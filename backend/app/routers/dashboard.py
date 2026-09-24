from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.lead import Lead


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/stats")
def dashboard_stats(
    db: Session = Depends(get_db)
):

    total_leads = db.query(Lead).count()

    new_leads = db.query(Lead).filter(
        Lead.status == "New"
    ).count()

    contacted = db.query(Lead).filter(
        Lead.status == "Contacted"
    ).count()

    interested = db.query(Lead).filter(
        Lead.status == "Interested"
    ).count()

    followups = db.query(Lead).filter(
        Lead.status == "Follow-up"
    ).count()

    applications = db.query(Lead).filter(
        Lead.status.in_([
            "Application Started",
            "Application Submitted"
        ])
    ).count()

    converted = db.query(Lead).filter(
        Lead.status == "Converted"
    ).count()

    lost = db.query(Lead).filter(
        Lead.status == "Lost"
    ).count()

    conversion_rate = (
        round((converted / total_leads) * 100, 2)
        if total_leads > 0
        else 0
    )

    return {
        "total_leads": total_leads,
        "new_leads": new_leads,
        "contacted": contacted,
        "interested": interested,
        "followups": followups,
        "applications": applications,
        "converted": converted,
        "lost": lost,
        "conversion_rate": conversion_rate
    }