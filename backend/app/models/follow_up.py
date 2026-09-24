from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Text
)

from app.database import Base


class FollowUp(Base):
    __tablename__ = "followups"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    lead_id = Column(
        Integer,
        ForeignKey(
            "leads.id",
            ondelete="CASCADE"
        ),
        nullable=False
    )

    counsellor_id = Column(
        Integer,
        ForeignKey("counsellors.id")
    )

    followup_date = Column(
        DateTime,
        nullable=False
    )

    mode = Column(
        String(50)
    )

    outcome = Column(
        String(100)
    )

    remarks = Column(
        Text
    )

    next_followup_date = Column(
        DateTime
    )

    created_at = Column(
        DateTime
    )