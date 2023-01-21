from pydantic import BaseModel
from datetime import datetime
from src.mitre.schemas import TacticBase, TechniqueBase, SubTechniqueBase


class SigmaBase(BaseModel):
    id: int
    author : str
    logsource: str
    detection: str
    condition: str
    raw_text: str
    date_added: datetime
    tactics: list[TacticBase] | None = None
    techniques: list[TechniqueBase] | None = None
    subtechniques: list[SubTechniqueBase] | None = None

    class Config:
        orm_mode = True
