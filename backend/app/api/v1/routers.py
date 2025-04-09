from app.api.v1.core.endpoints.websocket import router as websocket_router
from app.api.v1.core.endpoints.account import router as account_router
from fastapi import APIRouter

router = APIRouter()

router.include_router(websocket_router)
router.include_router(account_router)
