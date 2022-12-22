from src.db import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import Mapped, relationship

tactic_yara = Table(
    "tactic_yara",
    Base.metadata,
    Column("tactic_id", ForeignKey("Tactic.id")),
    Column("yara_id", ForeignKey("YaraRule.id")),
)

class YaraRule(Base):
    __tablename__ = "YaraRule"
    id : Mapped[int] =  Column(Integer, primary_key=True, index=True, unique=True)
    name = Column(String, unique=True)
    meta = Column(String)
    strings = Column(String)
    conditions = Column(String)
    raw_text = Column(String)
    tactic = relationship("Tactic",
        secondary=tactic_yara, back_populates="yara_rules"
    )
    technique = Column(String, ForeignKey('Technique.id'), nullable=True)
    subtechnique = Column(String, ForeignKey('Subtechnique.id'), nullable=True)