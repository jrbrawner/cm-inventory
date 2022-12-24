from src.db import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import Mapped, relationship

tactic_yara = Table(
    "tactic_yara",
    Base.metadata,
    Column("tactic_id", ForeignKey("Tactic.id")),
    Column("yara_rule_id", ForeignKey("YaraRule.id")),
)

technique_yara = Table(
    "technique_yara",
    Base.metadata,
    Column("technique_id", ForeignKey("Technique.id")),
    Column("yara_rule_id", ForeignKey("YaraRule.id"))
)

subtechnique_yara = Table(
    "subtechnique_yara",
    Base.metadata,
    Column("subtechnique_id", ForeignKey("Subtechnique.id")),
    Column("yara_rule_id", ForeignKey("YaraRule.id"))
)

class YaraRule(Base):
    __tablename__ = "YaraRule"
    id : Mapped[int] =  Column(Integer, primary_key=True, index=True, unique=True)
    name = Column(String, unique=True)
    meta = Column(String)
    strings = Column(String)
    conditions = Column(String)
    raw_text = Column(String)
    tactics = relationship("Tactic",
        secondary=tactic_yara, back_populates="yara_rules"
    )
    techniques = relationship("Technique",
        secondary=technique_yara, back_populates="yara_rules"
    )
    subtechniques = relationship("Subtechnique",
        secondary=subtechnique_yara, back_populates="yara_rules"
    )