from src.db import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Table, DateTime
from sqlalchemy.orm import Mapped, relationship
from datetime import datetime

tactic_sigma = Table(
    "tactic_sigma",
    Base.metadata,
    Column("tactic_id", ForeignKey("Tactic.id")),
    Column("sigma_rule_id", ForeignKey("SigmaRule.id")),
)

technique_sigma = Table(
    "technique_sigma",
    Base.metadata,
    Column("technique_id", ForeignKey("Technique.id")),
    Column("sigma_rule_id", ForeignKey("SigmaRule.id")),
)

subtechnique_sigma = Table(
    "subtechnique_sigma",
    Base.metadata,
    Column("subtechnique_id", ForeignKey("Subtechnique.id")),
    Column("sigma_rule_id", ForeignKey("SigmaRule.id")),
)

class SigmaRule(Base):
    __tablename__ = "SigmaRule"
    id : Mapped[int] = Column(Integer, primary_key=True)
    author : Mapped[str] = Column(String())
    logsource : Mapped[str] = Column(String())
    detection : Mapped[str] = Column(String())
    condition : Mapped[str] = Column(String())
    raw_text : Mapped[str] = Column(String())
    tactics = relationship("Tactic", secondary=tactic_sigma, back_populates="sigma_rules")
    techniques = relationship(
        "Technique", secondary=technique_sigma, back_populates="sigma_rules"
    )
    subtechniques = relationship(
        "Subtechnique", secondary=subtechnique_sigma, back_populates="sigma_rules"
    )
    date_added : Mapped[DateTime] = Column(DateTime, default=datetime.utcnow)
    date_modified : Mapped[DateTime] = Column(DateTime, default=datetime.utcnow)