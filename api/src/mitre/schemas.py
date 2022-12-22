from pydantic import BaseModel, HttpUrl, ValidationError, validator
from pydantic.schema import Optional
from typing import List, Optional

class TacticBase(BaseModel):
    """ Python (Pydantic) model representing a Mitre Attack Framework Tactic. """
    id: Optional[str]
    name: Optional[str]
    description: Optional[str]
    reference: Optional[str]
    
    class Config:
        orm_mode = True

class TechniquePlatformBase(BaseModel):
    id: int
    technique_id: str
    platform: str

    class Config:
        orm_mode = True

class TechniqueReferenceBase(BaseModel):
    id: int
    technique_id: str
    url: HttpUrl

    class Config:
        orm_mode = True

class TechniqueDataSource(BaseModel):
    id: int
    technique_id: str
    data_source: str

    class Config:
        orm_mode = True

class TechniqueDefenseBypassed(BaseModel):
    technique_id: str
    defense_bypassed: str

    class Config:
        orm_mode = True


class TechniqueBase(BaseModel):
    """Python (Pydantic) model representing a Mitre Attack Framework Technique. """
    id: str
    platforms: List[Optional[TechniquePlatformBase]]
    name: str
    description: str
    references: List[Optional[TechniqueReferenceBase]]
    tactics: List[TacticBase] 
    detection: str | None = None
    data_sources: List[Optional[TechniqueDataSource]]
    defenses_bypassed: List[Optional[TechniqueDefenseBypassed]]

    #@validator('tactics')
    #def convert_tactic(cls, v):
    #    tactics = {
    #        'reconnaissance': 'Reconnaissance',
    #        'resource-development': 'Resource Development',
    #        'initial-access': 'Initial Access',
    #        'execution': 'Execution',
    #        'persistence': 'Persistence',
    #        'privilege-escalation': 'Privilege Escalation',
    #        'defense-evasion': 'Defense Evasion',
    #        'credential-access': 'Credential Access',
    #        'discovery': 'Discovery',
    #        'lateral-movement': 'Lateral Movement',
    #        'collection': 'Collection',
    #        'command-and-control': 'Command and Control',
    #        'exfiltration': 'Exfiltration',
    #        'impact': 'Impact'
    #    }
    #    tactics_list = [tactics.get(x) for x in v]
    #    return tactics_list

    class Config:
        orm_mode = True

class TacticTechnique(TacticBase):
    techniques: List[TechniqueBase] | None = None


class SubTechniqueBase(BaseModel):
    """Python (Pydantic) model representing a Mitre Attack Framework Technique. """
    id: str
    platforms: List[str]
    name: str
    description: str
    references: List[Optional[HttpUrl]]
    tactics: List[str] #change this to tactic object later
    technique: str #change this to technique object later
    detection: str
    data_sources: List[str]
    defense_bypassed: List[Optional[str]]

    #@validator('tactics')
    #def convert_tactic(cls, v):
    #    tactics = {
    #        'reconnaissance': 'Reconnaissance',
    #        'resource-development': 'Resource Development',
     #       'initial-access': 'Initial Access',
     #       'execution': 'Execution',
     #       'persistence': 'Persistence',
     #       'privilege-escalation': 'Privilege Escalation',
     #       'defense-evasion': 'Defense Evasion',
     #       'credential-access': 'Credential Access',
     #       'discovery': 'Discovery',
    #        'lateral-movement': 'Lateral Movement',
    #        'collection': 'Collection',
    #        'command-and-control': 'Command and Control',
    #        'exfiltration': 'Exfiltration',
    #        'impact': 'Impact'
    #    }
    #    tactics_list = [tactics.get(x) for x in v]
    #    return tactics_list

    class Config:
        orm_mode = True
