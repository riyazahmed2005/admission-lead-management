from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, ConfigDict


class LeadCreate(BaseModel):
    student_name: str
    phone: str
    email: Optional[EmailStr] = None
    city: Optional[str] = None
    qualification: Optional[str] = None

    course_id: Optional[int] = None
    source_id: Optional[int] = None
    counsellor_id: Optional[int] = None

    status: str = "New"
    priority: str = "Medium"


class LeadUpdate(BaseModel):
    student_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    city: Optional[str] = None
    qualification: Optional[str] = None

    course_id: Optional[int] = None
    source_id: Optional[int] = None
    counsellor_id: Optional[int] = None

    status: Optional[str] = None
    priority: Optional[str] = None


class LeadResponse(BaseModel):
    id: int
    student_name: str
    phone: str
    email: Optional[str]
    city: Optional[str]
    qualification: Optional[str]

    course_id: Optional[int]
    source_id: Optional[int]
    counsellor_id: Optional[int]

    status: str
    priority: str

    created_at: datetime
    updated_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)