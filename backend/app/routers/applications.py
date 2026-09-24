from datetime import datetime
from typing import Optional

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query
)

from sqlalchemy.orm import Session

from app.database import get_db
from app.models.application import Application
from app.models.lead import Lead

from app.schemas.application import (
    ApplicationCreate,
    ApplicationUpdate,
    ApplicationResponse
)


router = APIRouter(
    prefix="/applications",
    tags=["Applications"]
)


# ---------------------------------------------------------
# CREATE APPLICATION
# ---------------------------------------------------------

@router.post(
    "",
    response_model=ApplicationResponse,
    status_code=201
)
def create_application(
    application_data: ApplicationCreate,
    db: Session = Depends(get_db)
):

    lead = (
        db.query(Lead)
        .filter(
            Lead.id ==
            application_data.lead_id
        )
        .first()
    )

    if not lead:
        raise HTTPException(
            status_code=404,
            detail="Lead not found"
        )

    existing = (
        db.query(Application)
        .filter(
            Application.application_number
            ==
            application_data.application_number
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Application number already exists"
        )

    application = Application(
        **application_data.model_dump(),
        created_at=datetime.now(),
        updated_at=datetime.now()
    )

    db.add(application)

    # Automatically move lead to
    # Application Started
    if lead.status == "New":
        lead.status = "Application Started"

    db.commit()
    db.refresh(application)

    return application


# ---------------------------------------------------------
# GET ALL APPLICATIONS
# ---------------------------------------------------------

@router.get(
    "",
    response_model=list[ApplicationResponse]
)
def get_applications(
    lead_id: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    payment_status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):

    query = db.query(Application)

    if lead_id:
        query = query.filter(
            Application.lead_id ==
            lead_id
        )

    if status:
        query = query.filter(
            Application.status ==
            status
        )

    if payment_status:
        query = query.filter(
            Application.payment_status ==
            payment_status
        )

    return query.order_by(
        Application.created_at.desc()
    ).all()


# ---------------------------------------------------------
# GET SINGLE APPLICATION
# ---------------------------------------------------------

@router.get(
    "/{application_id}",
    response_model=ApplicationResponse
)
def get_application(
    application_id: int,
    db: Session = Depends(get_db)
):

    application = (
        db.query(Application)
        .filter(
            Application.id ==
            application_id
        )
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    return application


# ---------------------------------------------------------
# UPDATE APPLICATION
# ---------------------------------------------------------

@router.put(
    "/{application_id}",
    response_model=ApplicationResponse
)
def update_application(
    application_id: int,
    application_data: ApplicationUpdate,
    db: Session = Depends(get_db)
):

    application = (
        db.query(Application)
        .filter(
            Application.id ==
            application_id
        )
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    update_data = (
        application_data.model_dump(
            exclude_unset=True
        )
    )

    if (
        "application_number"
        in update_data
    ):

        existing = (
            db.query(Application)
            .filter(
                Application.application_number
                ==
                update_data[
                    "application_number"
                ],
                Application.id !=
                application_id
            )
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Application number already exists"
            )

    for key, value in update_data.items():
        setattr(
            application,
            key,
            value
        )

    application.updated_at = (
        datetime.now()
    )

    db.commit()
    db.refresh(application)

    return application


# ---------------------------------------------------------
# DELETE APPLICATION
# ---------------------------------------------------------

@router.delete(
    "/{application_id}"
)
def delete_application(
    application_id: int,
    db: Session = Depends(get_db)
):

    application = (
        db.query(Application)
        .filter(
            Application.id ==
            application_id
        )
        .first()
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    db.delete(application)

    db.commit()

    return {
        "message":
        "Application deleted successfully"
    }