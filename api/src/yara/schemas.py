from pydantic import BaseModel
from src.mitre.schemas import TacticBase, TechniqueBase, SubTechniqueBase
from datetime import datetime


class YaraSchema(BaseModel):
    name: str
    meta: str
    strings: str
    conditions: str
    raw_text: str
    logic_hash: str
    author: str
    description: str
    date_added: datetime
    compiles: str
    tactics: list[TacticBase] | None = None
    techniques: list[TechniqueBase] | None = None
    subtechniques: list[SubTechniqueBase] | None = None

    class Config:
        orm_mode = True
