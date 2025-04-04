from app.api.vi.core.endpoints.websocket import router as websocket_router
from fastapi import APIRouter

router = APIRouter()

router.include_router(websocket_router)
