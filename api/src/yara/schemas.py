from pydantic import BaseModel, validator
from src.mitre.schemas import TacticBase, TechniqueBase, SubTechniqueBase

class YaraSchema(BaseModel):
    name : str
    meta : str
    strings : str
    conditions : str
    raw_text : str
    tactics : list[TacticBase] | None = None
    techniques : list[TechniqueBase] | None = None
    subtechniques : list[SubTechniqueBase] | None = None

    class Config:
        orm_mode = True

class YaraCreate(BaseModel):
    name : str 
    meta : str 
    strings : str 
    conditions : str 
    raw_text : str  
    tactics : list[TacticBase] | None = None
    techniques : list[TechniqueBase] | None = None
    subtechniques : list[SubTechniqueBase] | None = None

    class Config:
        orm_mode = True