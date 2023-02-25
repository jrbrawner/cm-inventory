from pydantic import BaseModel, validator
from datetime import datetime
from src.mitre.schemas import TacticBase, TechniqueBase, SubTechniqueBase
import json

class SnortSchema(BaseModel):
    id: int
    action: str
    protocol: str
    src_ip: str | None = None
    src_port: str | None = None
    direction: str | None = None  # service rules will have None for these fields
    dst_ip: str | None = None
    dst_port: str | None = None
    body_options: str
    date_added: datetime
    msg : str | None = None #used for rule name
    tactics: list[TacticBase] | None = None
    techniques: list[TechniqueBase] | None = None
    subtechniques: list[SubTechniqueBase] | None = None
    raw_text: str

    class Config:
        orm_mode = True
