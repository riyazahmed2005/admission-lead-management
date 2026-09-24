from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base


class Counsellor(Base):
    __tablename__ = "counsellors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True)
    phone = Column(String(20))
    is_active = Column(Boolean, default=True)