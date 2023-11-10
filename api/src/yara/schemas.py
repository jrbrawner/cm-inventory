from pydantic import BaseModel
from src.mitre.schemas import TacticBase, TechniqueBase, SubTechniqueBase
from datetime import datetime


class YaraSchema(BaseModel):
    id: int
    name: str
    meta: str | None = None
    strings: str | None = None
    conditions: str
    imports: str | None = None
    tags: str | None = None
    raw_text: str
    logic_hash: str
    author: str | None = None
    description: str | None = None
    date_added: datetime
    date_last_modified: datetime
    compiles: str
    tactics: list[TacticBase] | None = None
    techniques: list[TechniqueBase] | None = None
    subtechniques: list[SubTechniqueBase] | None = None

    class Config:
        from_attributes = True
