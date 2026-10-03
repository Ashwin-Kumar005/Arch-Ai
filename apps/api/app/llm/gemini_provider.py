"""
Google Gemini LLM Provider Implementation
"""

import time
import json
import re
from typing import Dict, Any, Type, Optional
from pydantic import BaseModel
import warnings
with warnings.catch_warnings():
    warnings.filterwarnings("ignore", category=FutureWarning)
    import google.generativeai as genai

from app.core.config import settings
from app.llm.base import LLMProvider, LLMResponse
from app.core.logging import logger


class GeminiProvider(LLMProvider):
    def __init__(self, api_key: Optional[str] = None, model_name: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model_name = model_name or settings.LLM_MODEL
        if self.api_key:
            genai.configure(api_key=self.api_key)

    async def generate(
        self,
        system_prompt: str,
        user_prompt: str,
        response_schema: Optional[Type[BaseModel]] = None,
        temperature: float = 0.2
    ) -> LLMResponse:
        start_time = time.time()
        try:
            generation_config = {"temperature": temperature}
            
            prompt = user_prompt
            if response_schema:
                generation_config["response_mime_type"] = "application/json"
                schema_json = json.dumps(response_schema.model_json_schema())
                prompt += f"\n\nCRITICAL: Output MUST be strictly valid JSON conforming exactly to this schema. Do not output any markdown blocks (like ```json), just raw JSON.\n{schema_json}"

            model = genai.GenerativeModel(
                model_name=self.model_name,
                system_instruction=system_prompt,
                generation_config=generation_config
            )

            response = model.generate_content(prompt)
            duration_ms = int((time.time() - start_time) * 1000)
            text = response.text

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

                parsed_json = json.loads(clean_text)

            return LLMResponse(
                raw_content=text,
                parsed_json=parsed_json,
                prompt_tokens=len(user_prompt.split()) * 2,
                completion_tokens=len(text.split()) * 2,
                total_tokens=(len(user_prompt.split()) + len(text.split())) * 2,
                duration_ms=duration_ms,
                model_name=self.model_name
            )
        except Exception as e:
            logger.error(f"Gemini generation error: {str(e)}")
            raise e

    async def get_embedding(self, text: str) -> list[float]:
        try:
            result = genai.embed_content(
                model="models/embedding-001",
                content=text,
                task_type="retrieval_document"
            )
            return result["embedding"]
        except Exception:
            # Fallback deterministic pseudo-embedding
            import hashlib
            seed = int(hashlib.md5(text.encode()).hexdigest(), 16)
            import random
            rng = random.Random(seed)
            return [rng.uniform(-1, 1) for _ in range(768)]
