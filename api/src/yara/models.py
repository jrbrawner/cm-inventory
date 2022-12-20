from src.db import Base
from sqlalchemy import Column, Integer, String, ForeignKey

class YaraRule(Base):
    __tablename__ = "YaraRule"
    id = Column(Integer, primary_key=True, index=True, unique=True)
    name = Column(String, unique=True)
    meta = Column(String)
    strings = Column(String)
    conditions = Column(String)
    raw_text = Column(String)
    tactic = Column(String, ForeignKey('Tactic.id'), nullable=True)
    technique = Column(String, ForeignKey('Technique.id'), nullable=True)
    subtechnique = Column(String, ForeignKey('Subtechnique.id'), nullable=True)