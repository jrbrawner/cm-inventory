from fastapi import APIRouter, HTTPException, Depends
from src.mitre.schemas import TacticBase, TechniqueBase, SubTechniqueBase, TacticTechnique
from src.mitre.constants import MitreLookup
from sqlalchemy.orm import Session
from src.dependencies import get_db
from src.mitre import services

router = APIRouter()

@router.get("/mitre/tactic/{type}/{term}", response_model=TacticBase, tags=['mitre'])
def get_mitre_tactic(type: MitreLookup, term: str, db: Session = Depends(get_db)) -> TacticBase:
    if type is MitreLookup.ID:
        tactic = services.get_mitre_tactic_id(db, term)
        if tactic is None:
            raise HTTPException(404, 'No tactic found with that id.')
        return tactic
    if type is MitreLookup.Name:
        tactic = services.get_mitre_tactic_name(db, term)
        if tactic is None:
            raise HTTPException(404, 'No tactic found with that name.')
        return tactic

@router.get("/mitre/tactic/{type}/{term}/techniques", response_model=TacticTechnique, tags=['mitre'])
def get_mitre_tactic_techniques(type: MitreLookup, term: str, db: Session = Depends(get_db)) -> TacticTechnique:
    if type is MitreLookup.ID:
        tactic = services.get_mitre_tactic_id(db, term)
        if tactic is None:
            raise HTTPException(404, 'No tactic found with that id.')
        return tactic
    if type is MitreLookup.Name:
        tactic = services.get_mitre_tactic_name(db, term)
        if tactic is None:
            raise HTTPException(404, 'No tactic found with that name.')
        
        
        
        return tactic
