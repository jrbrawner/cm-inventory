from src.db import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Table, DateTime
from sqlalchemy.orm import Mapped, relationship
from datetime import datetime

tactic_snort = Table(
    "tactic_snort",
    Base.metadata,
    Column("tactic_id", ForeignKey("Tactic.id")),
    Column("snort_rule_id", ForeignKey("SnortRule.id")),
)

technique_snort = Table(
    "technique_snort",
    Base.metadata,
    Column("technique_id", ForeignKey("Technique.id")),
    Column("snort_rule_id", ForeignKey("SnortRule.id")),
)

subtechnique_snort = Table(
    "subtechnique_snort",
    Base.metadata,
    Column("subtechnique_id", ForeignKey("Subtechnique.id")),
    Column("snort_rule_id", ForeignKey("SnortRule.id")),
)


class SnortRule(Base):
    __tablename__ = "SnortRule"
    id: Mapped[int] = Column(Integer, primary_key=True, index=True)
    action: Mapped[str] = Column(String)
    protocol: Mapped[str] = Column(String)
    src_ip: Mapped[str] = Column(String)
    src_port: Mapped[str] = Column(String)
    direction: Mapped[str] = Column(String)
    dst_ip: Mapped[str] = Column(String)
    dst_port: Mapped[str] = Column(String)
    body_options: Mapped[str] = Column(String)
    msg: Mapped[str] = Column(String)  # used for rule name
    date_added: Mapped[DateTime] = Column(DateTime, default=datetime.utcnow)
    hash: Mapped[str] = Column(String, unique=True)
    cve: Mapped[str] = Column(String)
    raw_text: Mapped[str] = Column(String)
    tactics = relationship(
        "Tactic", secondary=tactic_snort, back_populates="snort_rules"
    )
    techniques = relationship(
        "Technique", secondary=technique_snort, back_populates="snort_rules"
    )
    subtechniques = relationship(
        "Subtechnique", secondary=subtechnique_snort, back_populates="snort_rules"
    )
