from fastapi import APIRouter, HTTPException, Depends
from src.yara.schemas import YaraSchema, YaraCreate
from sqlalchemy.orm import Session
from src.dependencies import get_db, get_current_user
from src.yara import services
from typing import List

router = APIRouter()

@router.post("/yara", response_model=List[YaraCreate], tags=['yara'])
def create_yara_rules(rules_text: str, db: Session = Depends(get_db)):
    yara_rule_list = services.create_yara_rules(db, rules_text)
    if yara_rule_list is None:
        raise HTTPException(400, 'Error in rule creation.')
    return yara_rule_list

@router.get("/yara", response_model=YaraSchema, tags=['yara'])
def get_yara_rule(rule_name: str, db: Session = Depends(get_db)):
    pass