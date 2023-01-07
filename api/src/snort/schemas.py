from pydantic import BaseModel
from datetime import datetime

class SnortSchema(BaseModel):
    action : str
    protocol : str
    src_ip : str
    src_port : str
    direction : str
    dst_ip : str
    dst_port : str
    body : str
    body_options : str
    date_added : datetime

    class Config:
        orm_mode = True