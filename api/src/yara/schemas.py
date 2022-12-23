from pydantic import BaseModel, validator
from src.mitre.schemas import TacticBase, TechniqueBase, SubTechniqueBase
from pydantic.schema import Optional

class YaraSchema(BaseModel):
    name : str
    meta : str
    strings : str
    conditions : str
    raw_text : str
    tactics : list[TacticBase]
    #technique : Optional[TechniqueBase]
    #subtechnique : Optional[SubTechniqueBase]

    class Config:
        orm_mode = True

class YaraCreate(BaseModel):
    name : str
    meta : str
    strings : str
    conditions : str
    raw_text : str
    tactics : list[TacticBase] | None = None
    technique : TacticBase | None = None
    subtechnique : str | None = None

    class Config:
        orm_mode = True