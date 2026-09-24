from fastapi import FastAPI

from app.database import Base, engine

# Import models so SQLAlchemy knows about all tables
from app.models import (
    Course,
    LeadSource,
    Counsellor,
    Lead,
    FollowUp,
    Application
)

# Import routers
from app.routers.leads import router as lead_router
from app.routers.dashboard import router as dashboard_router
from app.routers.master_data import router as master_router
from app.routers.follow_ups import router as followup_router
from app.routers.applications import router as application_router
from app.models.follow_up import FollowUp


# Create database tables
Base.metadata.create_all(bind=engine)


# Create FastAPI application FIRST
app = FastAPI(
    title="Admission Lead Management API",
    description="Admission Lead Management System",
    version="1.0.0"
)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Register routers AFTER app is created
app.include_router(lead_router)
app.include_router(dashboard_router)
app.include_router(master_router)
app.include_router(followup_router)
app.include_router(application_router)

@app.get("/")
def root():
    return {
        "message": "Admission Lead Management API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }   