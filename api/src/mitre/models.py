from sqlalchemy import Column, Integer, String, Table, ForeignKey
from src.db import Base, engine
from sqlalchemy.orm import relationship, Mapped
from src.yara.models import YaraRule, tactic_yara, technique_yara, subtechnique_yara

technique_to_tactic = Table(
    "technique_to_tactic",
    Base.metadata,
    Column(("technique_id"), String, ForeignKey("Technique.id"), primary_key=True),
    Column(("tactic_id"), String, ForeignKey("Tactic.id"), primary_key=True),
)


class Tactic(Base):
    """DB Class representing Mitre Attack Framework Tactics."""

    __tablename__ = "Tactic"
    id = Column(String, primary_key=True, index=True, unique=True)
    name = Column(String, unique=True)
    description = Column(String)
    techniques = relationship(
        "Technique", secondary="technique_to_tactic", back_populates="tactics"
    )
    reference = Column(String)
    yara_rules: Mapped[list[YaraRule]] = relationship(
        "YaraRule",
        secondary=tactic_yara,
        back_populates="tactics",
    )


class TechniquePlatform(Base):
    __tablename__ = "TechniquePlatform"
    id = Column(Integer, primary_key=True)
    technique_id = Column(String, ForeignKey("Technique.id"))
    platform = Column(String)


class TechniqueReference(Base):
    __tablename__ = "TechniqueReference"
    id = Column(Integer, primary_key=True)
    technique_id = Column(String, ForeignKey("Technique.id"))
    url = Column(String)


class TechniqueDataSource(Base):
    __tablename__ = "TechniqueDataSource"
    id = Column(Integer, primary_key=True)
    technique_id = Column(String, ForeignKey("Technique.id"))
    data_source = Column(String)


class TechniqueDefenseBypassed(Base):
    __tablename__ = "TechniqueDefenseBypassed"
    id = Column(Integer, primary_key=True)
    technique_id = Column(String, ForeignKey("Technique.id"))
    defense_bypassed = Column(String)


class Technique(Base):
    """DB Class representing Mitre Attack Framework Techniques."""

    __tablename__ = "Technique"
    id = Column(String, primary_key=True, index=True, unique=True)
    name = Column(String, unique=True)
    description = Column(String)
    detection = Column(String)
    platforms = relationship("TechniquePlatform")
    references = relationship("TechniqueReference")
    data_sources = relationship("TechniqueDataSource")
    defenses_bypassed = relationship("TechniqueDefenseBypassed")

    tactics = relationship(
        "Tactic", secondary="technique_to_tactic", back_populates="techniques"
    )
    yara_rules: Mapped[list[YaraRule]] = relationship(
        "YaraRule",
        secondary=technique_yara,
        back_populates="techniques",
    )
    subtechniques = relationship("Subtechnique")


class SubtechniquePlatform(Base):
    __tablename__ = "SubtechniquePlatform"
    id = Column(Integer, primary_key=True)
    technique_id = Column(String, ForeignKey("Subtechnique.id"))
    platform = Column(String)


class SubtechniqueReference(Base):
    __tablename__ = "SubtechniqueReference"
    id = Column(Integer, primary_key=True)
    technique_id = Column(String, ForeignKey("Subtechnique.id"))
    url = Column(String)


class SubtechniqueDataSource(Base):
    __tablename__ = "SubtechniqueDataSource"
    id = Column(Integer, primary_key=True)
    technique_id = Column(String, ForeignKey("Subtechnique.id"))
    data_source = Column(String)


class SubtechniqueDefenseBypassed(Base):
    __tablename__ = "SubtechniqueDefenseBypassed"
    id = Column(Integer, primary_key=True)
    technique_id = Column(String, ForeignKey("Subtechnique.id"))
    defense_bypassed = Column(String)


class Subtechnique(Base):
    """DB Class representing Mitre Attack Framework Subtechnique."""

    __tablename__ = "Subtechnique"
    id = Column(String, primary_key=True, index=True, unique=True)
    name = Column(String, unique=False)
    description = Column(String)
    detection = Column(String)
    platforms = relationship("SubtechniquePlatform")
    references = relationship("SubtechniqueReference")
    data_sources = relationship("SubtechniqueDataSource")
    defenses_bypassed = relationship("SubtechniqueDefenseBypassed")
    yara_rules: Mapped[list[YaraRule]] = relationship(
        "YaraRule",
        secondary=subtechnique_yara,
        back_populates="subtechniques",
    )

    technique_id = Column(String, ForeignKey("Technique.id"))
