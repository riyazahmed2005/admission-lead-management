from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class FollowUpBase(BaseModel):
    lead_id: int
    counsellor_id: Optional[int] = None

    followup_date: datetime

    mode: Optional[str] = None
    outcome: Optional[str] = None
    remarks: Optional[str] = None

    next_followup_date: Optional[datetime] = None


class FollowUpCreate(FollowUpBase):
    pass


class FollowUpUpdate(BaseModel):
    lead_id: Optional[int] = None
    counsellor_id: Optional[int] = None

    followup_date: Optional[datetime] = None

    mode: Optional[str] = None
    outcome: Optional[str] = None
    remarks: Optional[str] = None

    next_followup_date: Optional[datetime] = None


class FollowUpResponse(FollowUpBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True      