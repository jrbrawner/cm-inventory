from sqlalchemy import Boolean, Column, Integer, String, DateTime
from api.db import Base


class UserModel(Base):
    """User account model."""

    __tablename__ = "Users"
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=True, unique=False)
    last_name = Column(String, nullable=True, unique=False)
    major = Column(String, nullable=True, unique=False)
    grad_year = Column(String(4), nullable=True, unique=False)
    username = Column(String(16), nullable=True, unique=True)
    email = Column(String(40), unique=True, nullable=False)
    password = Column(String(200), primary_key=False, unique=False, nullable=False)
    created_on = Column(DateTime, index=False, unique=False, nullable=True)
    last_login = Column(DateTime, index=False, unique=False, nullable=True)
    profile_pic = Column(String(), index=False, unique=False, nullable=True)
