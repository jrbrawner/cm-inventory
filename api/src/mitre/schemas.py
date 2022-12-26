from pydantic import BaseModel, HttpUrl, ValidationError, validator
from pydantic.schema import Optional
from typing import Optional


class TacticBase(BaseModel):
    """Python (Pydantic) model representing a Mitre Attack Framework Tactic."""

    id: str
    name: str
    description: str
    reference: str

    class Config:
        orm_mode = True


class TacticExtended(BaseModel):
    """Python (Pydantic) model representing a Mitre Attack Framework Tactic."""

    id: str
    name: str
    description: str
    reference: str

    class Config:
        orm_mode = True


class TechniquePlatformBase(BaseModel):
    platform: str

    class Config:
        orm_mode = True


class TechniqueReferenceBase(BaseModel):
    url: HttpUrl

    class Config:
        orm_mode = True


class TechniqueDataSource(BaseModel):
    data_source: str

    class Config:
        orm_mode = True


class TechniqueDefenseBypassed(BaseModel):
    defense_bypassed: str

    class Config:
        orm_mode = True


class TechniqueBase(BaseModel):
    """Python (Pydantic) base model representing a Mitre Attack Framework Technique."""

    id: str
    name: str
    description: str

    class Config:
        orm_mode = True


class TechniqueExtended(BaseModel):
    """Python (Pydantic) extended model representing a Mitre Attack Framework Technique."""

    id: str
    platforms: list[TechniquePlatformBase]
    name: str
    description: str
    references: list[TechniqueReferenceBase]
    tactics: list[TacticBase]
    detection: str | None = None
    data_sources: list[TechniqueDataSource]
    defenses_bypassed: list[TechniqueDefenseBypassed]

    class Config:
        orm_mode = True


class TacticTechnique(TacticBase):
    techniques: list[TechniqueBase] | None = None


class SubTechniqueReference(BaseModel):
    url: HttpUrl

    class Config:
        orm_mode = True


class SubTechniqueDataSource(BaseModel):
    data_source: str

    class Config:
        orm_mode = True


class SubTechniqueDefenseBypassed(BaseModel):
    defense_bypassed: str

    class Config:
        orm_mode = True


class SubTechniquePlatform(BaseModel):
    platform: str

    class Config:
        orm_mode = True


class SubTechniqueBase(BaseModel):
    """Python (Pydantic) model representing a Mitre Attack Framework Technique."""

    id: str
    name: str
    description: str

    class Config:
        orm_mode = True


class SubTechniqueExtended(BaseModel):
    """Python (Pydantic) model representing a Mitre Attack Framework Technique."""

    id: str
    platforms: list[TechniquePlatformBase]
    name: str
    description: str
    references: list[SubTechniqueReference]
    detection: str
    data_sources: list[SubTechniqueDataSource]
    defenses_bypassed: list[SubTechniqueDefenseBypassed]

    class Config:
        orm_mode = True
