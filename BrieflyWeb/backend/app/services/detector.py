from typing import Protocol

class VideoDetector(Protocol):
    async def analyze(self, media: bytes) -> dict: ...

class NotConfiguredDetector:
    status = "NOT_CONFIGURED"
    async def analyze(self, media: bytes) -> dict:
        return {
            "status": self.status,
            "provider": None,
            "result": None,
            "confidence": None,
            "evidence": [],
            "limitations": ["No real media detector is configured. No media was analyzed."],
        }

detector: VideoDetector = NotConfiguredDetector()
