"""
ArchAI Real-time Event Bus for Server-Sent Events (SSE)
"""

import asyncio
import json
from typing import Dict, List, Any


class EventBus:
    def __init__(self):
        # project_id -> list of asyncio.Queue
        self._subscribers: Dict[str, List[asyncio.Queue]] = {}

    def subscribe(self, project_id: str) -> asyncio.Queue:
        if project_id not in self._subscribers:
            self._subscribers[project_id] = []
        queue = asyncio.Queue()
        self._subscribers[project_id].append(queue)
        return queue

    def unsubscribe(self, project_id: str, queue: asyncio.Queue):
        if project_id in self._subscribers:
            if queue in self._subscribers[project_id]:
                self._subscribers[project_id].remove(queue)
            if not self._subscribers[project_id]:
                del self._subscribers[project_id]

    async def publish(self, project_id: str, event_type: str, data: Dict[str, Any]):
        message = {
            "event": event_type,
            "data": data
        }
        if project_id in self._subscribers:
            for queue in self._subscribers[project_id]:
                await queue.put(message)


event_bus = EventBus()
