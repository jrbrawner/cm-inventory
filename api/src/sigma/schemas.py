from pydantic import BaseModel
from datetime import datetime
from src.mitre.schemas import TacticBase, TechniqueBase, SubTechniqueBase


class SigmaSchema(BaseModel):
    id: int
    author : str | None = None
    title : str | None = None
    description : str | None = None
    logsource: str
    detection: str
    condition: str
    raw_text: str
    date_added: datetime
    tactics: list[TacticBase] | None = None
    techniques: list[TechniqueBase] | None = None
    subtechniques: list[SubTechniqueBase] | None = None

    class Config:
        from_attributes = True
