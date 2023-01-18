from pydantic import BaseModel
from datetime import datetime
from src.mitre.schemas import TacticBase, TechniqueBase, SubTechniqueBase

class SnortSchema(BaseModel):
    id : int
    action : str
    protocol : str
    src_ip : str
    src_port : str
    direction : str
    dst_ip : str
    dst_port : str
    body_options : str
    date_added : datetime
    tactics : list[TacticBase] | None = None
    techniques : list[TechniqueBase] | None = None
    subtechniques : list[SubTechniqueBase] | None = None

    class Config:
        orm_mode = True