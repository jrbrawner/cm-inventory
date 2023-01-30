from src.db import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Table, DateTime
from sqlalchemy.orm import Mapped, relationship
from datetime import datetime

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
    Column("yara_rule_id", ForeignKey("YaraRule.id")),
)

subtechnique_yara = Table(
    "subtechnique_yara",
    Base.metadata,
    Column("subtechnique_id", ForeignKey("Subtechnique.id")),
    Column("yara_rule_id", ForeignKey("YaraRule.id")),
)


class YaraRule(Base):
    __tablename__ = "YaraRule"
    id: Mapped[int] = Column(Integer, primary_key=True, index=True, unique=True)
    name: Mapped[str] = Column(String, unique=True)
    meta: Mapped[str] = Column(String)
    strings: Mapped[str] = Column(String)
    conditions: Mapped[str] = Column(String)
    raw_text: Mapped[str] = Column(String)
    logic_hash: Mapped[str] = Column(String)
    imports : Mapped[str] = Column(String)
    tags : Mapped[str] = Column(String)
    author: Mapped[str] = Column(String)
    description: Mapped[str] = Column(String)
    date_added = Column(DateTime, default=datetime.utcnow)
    date_last_modified = Column(DateTime, default=datetime.utcnow)
    compiles: Mapped[bool] = Column(String)
    tactics = relationship("Tactic", secondary=tactic_yara, back_populates="yara_rules")
    techniques = relationship(
        "Technique", secondary=technique_yara, back_populates="yara_rules"
    )
    subtechniques = relationship(
        "Subtechnique", secondary=subtechnique_yara, back_populates="yara_rules"
    )
