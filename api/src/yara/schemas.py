from pydantic import BaseModel, validator
from src.mitre.schemas import TacticBase, TechniqueBase, SubTechniqueBase
from pydantic.schema import Optional

class YaraSchema(BaseModel):
    name : str
    meta : str
    strings : str
    conditions : str
    raw_text : str
    tactics : Optional[list[TacticBase]] | None = None
    techniques : Optional[list[TechniqueBase]] | None = None
    subtechniques : Optional[list[SubTechniqueBase]] | None = None

    class Config:
        orm_mode = True

class YaraCreate(BaseModel):
    name : str
    meta : str
    strings : str
    conditions : str
    raw_text : str
    tactics : Optional[list[TacticBase]] | None = None
    techniques : Optional[list[TechniqueBase]] | None = None
    subtechniques : Optional[list[SubTechniqueBase]] | None = None

    class Config:
        orm_mode = True