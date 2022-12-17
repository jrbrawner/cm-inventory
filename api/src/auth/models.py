from sqlalchemy import Column, DateTime, Integer, String
from src.db import Base


class User(Base):
    """User account model."""

    __tablename__ = "Users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True, unique=False)
    username = Column(String(16), nullable=True, unique=True)
    email = Column(String(40), unique=True, nullable=False)
    password = Column(String(200), primary_key=False, unique=False, nullable=False)
    created_on = Column(DateTime, index=False, unique=False, nullable=True)
    last_login = Column(DateTime, index=False, unique=False, nullable=True)
    profile_pic = Column(String(), index=False, unique=False, nullable=True)