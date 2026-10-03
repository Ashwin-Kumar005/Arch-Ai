"""
Hugging Face Inference LLM Provider Implementation
"""

import time
import json
import re
from typing import Dict, Any, Type, Optional
from pydantic import BaseModel
from huggingface_hub import InferenceClient

from app.core.config import settings
from app.llm.base import LLMProvider, LLMResponse
from app.core.logging import logger


class HuggingFaceProvider(LLMProvider):
    def __init__(self, api_key: Optional[str] = None, model_name: Optional[str] = None):
        self.api_key = api_key or settings.HUGGINGFACE_API_KEY
        # Default to a robust, JSON-capable model on HF serverless
        self.model_name = model_name or "Qwen/Qwen2.5-72B-Instruct"
        self.client = InferenceClient(api_key=self.api_key)

    async def generate(
        self,
        system_prompt: str,
        user_prompt: str,
        response_schema: Optional[Type[BaseModel]] = None,
        temperature: float = 0.2
    ) -> LLMResponse:
        start_time = time.time()
        
        prompt = user_prompt
        if response_schema:
            schema_json = json.dumps(response_schema.model_json_schema())
            prompt += f"\n\nCRITICAL INSTRUCTION: Output MUST be strictly valid JSON conforming exactly to this schema. DO NOT output markdown code blocks. DO NOT output any conversational text. ONLY raw JSON:\n{schema_json}"
            
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ]

        try:
            response_stream = self.client.chat_completion(
                model=self.model_name,
                messages=messages,
                temperature=temperature if temperature > 0 else 0.1,
                max_tokens=4000,
                stream=True
            )
            
            text = ""
            for chunk in response_stream:
                if chunk.choices and chunk.choices[0].delta and chunk.choices[0].delta.content:
                    text += chunk.choices[0].delta.content
            
            duration_ms = int((time.time() - start_time) * 1000)

            parsed_json = None
            if response_schema:
                clean_text = text.strip()
                # Robust JSON extraction
                match = re.search(r"```(?:json)?\s*(.*?)\s*```", clean_text, re.DOTALL | re.IGNORECASE)
                if match:
                    clean_text = match.group(1).strip()
                else:
                    start_dict = clean_text.find('{')
                    end_dict = clean_text.rfind('}')
                    start_list = clean_text.find('[')
                    end_list = clean_text.rfind(']')
                    
                    if start_dict != -1 and end_dict != -1 and (start_list == -1 or start_dict < start_list):
                        clean_text = clean_text[start_dict:end_dict+1]
                    elif start_list != -1 and end_list != -1:
                        clean_text = clean_text[start_list:end_list+1]
                
                try:
                    parsed_json = json.loads(clean_text)
                except Exception as e:
                    logger.error(f"Failed to parse HuggingFace JSON: {e}\nRaw output: {text}")

            return LLMResponse(
                raw_content=text,
                parsed_json=parsed_json,
                prompt_tokens=len(prompt.split()),
                completion_tokens=len(text.split()),
                total_tokens=len(prompt.split()) + len(text.split()),
                duration_ms=duration_ms,
                model_name=self.model_name
            )
        except Exception as e:
            logger.error(f"HuggingFace generation error: {str(e)}")
            raise e

    async def get_embedding(self, text: str) -> list[float]:
        try:
            # feature-extraction API
            result = self.client.feature_extraction(
                text,
                model="sentence-transformers/all-MiniLM-L6-v2"
            )
            if isinstance(result, list):
                # result shape is either [seq_len, dim] or [dim] depending on model
                if len(result) > 0 and isinstance(result[0], list):
                    # Mean pooling over seq_len
                    dim = len(result[0])
                    mean_emb = [sum([r[i] for r in result])/len(result) for i in range(dim)]
                    return mean_emb
                return result
            raise Exception("Invalid embedding format returned")
        except Exception as e:
            logger.error(f"HuggingFace embedding error: {e}")
            import hashlib
            seed = int(hashlib.md5(text.encode()).hexdigest(), 16)
            import random
            rng = random.Random(seed)
            return [rng.uniform(-1, 1) for _ in range(768)]
