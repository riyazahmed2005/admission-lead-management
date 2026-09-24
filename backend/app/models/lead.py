from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey
)
from sqlalchemy.sql import func
from app.database import Base


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)

    student_name = Column(String(150), nullable=False)
    phone = Column(String(20), nullable=False, index=True)
    email = Column(String(150))
    city = Column(String(100))
    qualification = Column(String(100))

    course_id = Column(
        Integer,
        ForeignKey("courses.id")
    )

    source_id = Column(
        Integer,
        ForeignKey("lead_sources.id")
    )

    counsellor_id = Column(
        Integer,
        ForeignKey("counsellors.id")
    )

    status = Column(
        String(50),
        default="New"
    )

    priority = Column(
        String(20),
        default="Medium"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )