# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from .routers import products, orders, upload
from .database import engine
from . import models
from .config import settings

# Create tables
try:
    models.Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")
except Exception as e:
    print(f"⚠️  Error creating tables: {e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="E-commerce API for bridal wear and ornaments",
    version=settings.PROJECT_VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS middleware - FIXED
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,  # This should now work
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create upload directory if not exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

# Mount static files for uploaded images
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include routers
app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(orders.router, prefix="/api/orders", tags=["orders"])
app.include_router(upload.router, prefix="/api/upload", tags=["upload"])


@app.get("/")
async def root():
    return {"message": f"Welcome to {settings.PROJECT_NAME} API"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/config-test")
async def config_test():
    """Test endpoint to verify config is working"""
    return {
        "project": settings.PROJECT_NAME,
        "database_url": settings.DATABASE_URL[:50] + "..." if len(settings.DATABASE_URL) > 50 else settings.DATABASE_URL,
        "allowed_origins": settings.ALLOWED_ORIGINS,
        "upload_dir": settings.UPLOAD_DIR
    }