from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Numeric,
    Text
)

from app.database import Base


class Application(Base):
    __tablename__ = "applications"

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
        nullable=False,
        index=True
    )

    application_number = Column(
        String(100),
        unique=True,
        nullable=False,
        index=True
    )

    application_date = Column(
        DateTime
    )

    status = Column(
        String(50),
        nullable=False,
        default="Not Started"
    )

    fee_amount = Column(
        Numeric(10, 2),
        default=0
    )

    payment_status = Column(
        String(50),
        default="Pending"
    )

    remarks = Column(
        Text
    )

    created_at = Column(
        DateTime
    )

    updated_at = Column(
        DateTime
    )