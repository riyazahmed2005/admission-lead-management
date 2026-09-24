from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel


class ApplicationBase(BaseModel):

    lead_id: int

    application_number: str

    application_date: Optional[datetime] = None

    status: str = "Not Started"

    fee_amount: Decimal = Decimal("0")

    payment_status: str = "Pending"

    remarks: Optional[str] = None


class ApplicationCreate(
    ApplicationBase
):
    pass


class ApplicationUpdate(BaseModel):

    lead_id: Optional[int] = None

    application_number: Optional[str] = None

    application_date: Optional[datetime] = None

    status: Optional[str] = None

    fee_amount: Optional[Decimal] = None

    payment_status: Optional[str] = None

    remarks: Optional[str] = None


class ApplicationResponse(
    ApplicationBase
):

    id: int

    created_at: Optional[datetime] = None

    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True