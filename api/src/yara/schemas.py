from pydantic import BaseModel
from src.mitre.schemas import TacticBase, TechniqueBase, SubTechniqueBase

class YaraSchema(BaseModel):
    name : str
    meta : str
    strings : str
    conditions : str
    raw_text : str
    tactic : TacticBase | None = None
    technique : TechniqueBase | None = None
    subtechnique : SubTechniqueBase | None = None

    class Config:
        orm_mode = True

class YaraCreate(BaseModel):
    name : str
    meta : str
    strings : str
    conditions : str
    raw_text : str
    tactic : str | None = None
    technique : str | None = None
    subtechnique : str | None = None

    class Config:
        orm_mode = True