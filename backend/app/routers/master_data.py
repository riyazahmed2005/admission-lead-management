from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Course, LeadSource, Counsellor


router = APIRouter(
    prefix="/master",
    tags=["Master Data"]
)


@router.get("/courses")
def get_courses(db: Session = Depends(get_db)):
    return db.query(Course).order_by(Course.name).all()


@router.get("/sources")
def get_sources(db: Session = Depends(get_db)):
    return db.query(LeadSource).order_by(LeadSource.name).all()


@router.get("/counsellors")
def get_counsellors(db: Session = Depends(get_db)):
    return db.query(Counsellor).order_by(Counsellor.name).all()     