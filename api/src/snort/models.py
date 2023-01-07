from src.db import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Table, DateTime
from sqlalchemy.orm import Mapped, relationship
from datetime import datetime

class SnortRule(Base):
    __tablename__ = "SnortRule"
    id : Mapped[int] = Column(Integer, primary_key=True, index=True)
    action : Mapped[str] = Column(String)
    protocol : Mapped[str] = Column(String)
    src_ip : Mapped[str] = Column(String)
    src_port : Mapped[str] = Column(String)
    direction : Mapped[str] = Column(String)
    dst_ip : Mapped[str] = Column(String)
    dst_port : Mapped[str] = Column(String)
    body : Mapped[str] = Column(String)
    body_options : Mapped[str] = Column(String)
    date_added : Mapped[DateTime] = Column(DateTime, default=datetime.utcnow)