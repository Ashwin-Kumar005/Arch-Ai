"""
ArchAI FastAPI Main Application Entry Point
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core.logging import logger
from app.db.session import engine, Base
from app.api.v1.router import api_v1_router
# Import all models to ensure metadata registration
import app.models  # noqa


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    logger.info("Initializing ArchAI database schema...")
    Base.metadata.create_all(bind=engine)
    logger.info(f"ArchAI Backend active in {settings.APP_ENV} mode (DEMO_MODE={settings.DEMO_MODE})")
    yield
    logger.info("ArchAI Backend shutting down.")


app = FastAPI(
    title="ArchAI - AI Software Solution Architect API",
    description="Enterprise Multi-Agent Software Architecture Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def security_headers_and_logging_middleware(request: Request, call_next):
    logger.info(f"Inbound {request.method} {request.url.path}")
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error processing {request.method} {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error occurred. Telemetry recorded."}
    )


# Mount API Routes
app.include_router(api_v1_router, prefix=settings.API_V1_STR)


@app.get("/")
def root():
    return {
        "name": "ArchAI - AI Software Solution Architect",
        "tagline": "From Idea to Architecture in Minutes",
        "status": "ONLINE",
        "docs": "/docs",
        "api_v1": settings.API_V1_STR
    }


@app.get("/health")
@app.head("/health")
def health_check():
    return {
        "status": "HEALTHY",
        "app_name": settings.APP_NAME,
        "environment": settings.APP_ENV,
        "demo_mode": settings.DEMO_MODE,
        "llm_provider": settings.LLM_PROVIDER
    }
