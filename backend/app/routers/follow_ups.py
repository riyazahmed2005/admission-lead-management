from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.follow_up import FollowUp
from app.schemas.follow_up import (
    FollowUpCreate,
    FollowUpUpdate,
    FollowUpResponse
)

router = APIRouter(
    prefix="/followups",
    tags=["Follow-ups"]
)


@router.post(
    "",
    response_model=FollowUpResponse,
    status_code=201
)
def create_followup(
    followup_data: FollowUpCreate,
    db: Session = Depends(get_db)
):
    followup = FollowUp(
        **followup_data.model_dump()
    )

    db.add(followup)
    db.commit()
    db.refresh(followup)

    return followup


@router.get(
    "",
    response_model=list[FollowUpResponse]
)
def get_followups(
    lead_id: Optional[int] = Query(None),
    counsellor_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(FollowUp)

    if lead_id:
        query = query.filter(
            FollowUp.lead_id == lead_id
        )

    if counsellor_id:
        query = query.filter(
            FollowUp.counsellor_id == counsellor_id
        )

    return query.order_by(
        FollowUp.followup_date.desc()
    ).all()


@router.get(
    "/{followup_id}",
    response_model=FollowUpResponse
)
def get_followup(
    followup_id: int,
    db: Session = Depends(get_db)
):
    followup = db.query(FollowUp).filter(
        FollowUp.id == followup_id
    ).first()

    if not followup:
        raise HTTPException(
            status_code=404,
            detail="Follow-up not found"
        )

    return followup


@router.put(
    "/{followup_id}",
    response_model=FollowUpResponse
)
def update_followup(
    followup_id: int,
    followup_data: FollowUpUpdate,
    db: Session = Depends(get_db)
):
    followup = db.query(FollowUp).filter(
        FollowUp.id == followup_id
    ).first()

    if not followup:
        raise HTTPException(
            status_code=404,
            detail="Follow-up not found"
        )

    update_data = followup_data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(followup, key, value)

    db.commit()
    db.refresh(followup)

    return followup


@router.delete(
    "/{followup_id}"
)
def delete_followup(
    followup_id: int,
    db: Session = Depends(get_db)
):
    followup = db.query(FollowUp).filter(
        FollowUp.id == followup_id
    ).first()

    if not followup:
        raise HTTPException(
            status_code=404,
            detail="Follow-up not found"
        )

    db.delete(followup)
    db.commit()

    return {
        "message": "Follow-up deleted successfully"
    }