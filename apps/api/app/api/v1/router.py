"""
Aggregated API v1 Router
"""

from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.projects import router as projects_router
from app.api.v1.requirements import router as requirements_router
from app.api.v1.orchestration import router as orchestration_router
from app.api.v1.artifacts import router as artifacts_router
from app.api.v1.documents import router as documents_router
from app.api.v1.export import router as export_router
from app.api.v1.health import router as health_router
from app.api.v1.admin import router as admin_router

api_v1_router = APIRouter()

api_v1_router.include_router(health_router)
api_v1_router.include_router(auth_router)
api_v1_router.include_router(projects_router)
api_v1_router.include_router(requirements_router)
api_v1_router.include_router(orchestration_router)
api_v1_router.include_router(artifacts_router)
api_v1_router.include_router(documents_router)
api_v1_router.include_router(export_router)
api_v1_router.include_router(admin_router)
