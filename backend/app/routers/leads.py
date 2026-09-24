from typing import Optional

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query
)

from sqlalchemy.orm import Session

from app.database import get_db
from app.models.lead import Lead
from app.schemas.lead import (
    LeadCreate,
    LeadUpdate,
    LeadResponse
)

router = APIRouter(
    prefix="/leads",
    tags=["Leads"]
)


# ---------------------------------------------------------
# CREATE LEAD
# ---------------------------------------------------------

@router.post(
    "",
    response_model=LeadResponse,
    status_code=201
)
def create_lead(
    lead_data: LeadCreate,
    db: Session = Depends(get_db)
):
    lead = Lead(
        **lead_data.model_dump()
    )

    db.add(lead)
    db.commit()
    db.refresh(lead)

    return lead


# ---------------------------------------------------------
# GET ALL LEADS
# ---------------------------------------------------------

@router.get(
    "",
    response_model=list[LeadResponse]
)
def get_leads(
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    counsellor_id: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Lead)

    if status:
        query = query.filter(
            Lead.status == status
        )

    if priority:
        query = query.filter(
            Lead.priority == priority
        )

    if counsellor_id:
        query = query.filter(
            Lead.counsellor_id == counsellor_id
        )

    if search:
        search_text = f"%{search}%"

        query = query.filter(
            Lead.student_name.ilike(search_text)
        )

    return query.order_by(
        Lead.created_at.desc()
    ).all()


# ---------------------------------------------------------
# GET SINGLE LEAD
# ---------------------------------------------------------

@router.get(
    "/{lead_id}",
    response_model=LeadResponse
)
def get_lead(
    lead_id: int,
    db: Session = Depends(get_db)
):
    lead = (
        db.query(Lead)
        .filter(Lead.id == lead_id)
        .first()
    )

    if not lead:
        raise HTTPException(
            status_code=404,
            detail="Lead not found"
        )

    return lead


# ---------------------------------------------------------
# UPDATE LEAD
# ---------------------------------------------------------

@router.put(
    "/{lead_id}",
    response_model=LeadResponse
)
def update_lead(
    lead_id: int,
    lead_data: LeadUpdate,
    db: Session = Depends(get_db)
):
    lead = (
        db.query(Lead)
        .filter(Lead.id == lead_id)
        .first()
    )

    if not lead:
        raise HTTPException(
            status_code=404,
            detail="Lead not found"
        )

    update_data = lead_data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            lead,
            key,
            value
        )

    db.commit()
    db.refresh(lead)

    return lead


# ---------------------------------------------------------
# DELETE LEAD
# ---------------------------------------------------------

@router.delete(
    "/{lead_id}"
)
def delete_lead(
    lead_id: int,
    db: Session = Depends(get_db)
):
    lead = (
        db.query(Lead)
        .filter(Lead.id == lead_id)
        .first()
    )

    if not lead:
        raise HTTPException(
            status_code=404,
            detail="Lead not found"
        )

    db.delete(lead)
    db.commit()

    return {
        "message": "Lead deleted successfully"
    }