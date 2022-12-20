from fastapi import APIRouter, HTTPException, Depends
from src.yara.schemas import YaraSchema, YaraCreate
from sqlalchemy.orm import Session
from src.dependencies import get_db, get_current_user
from src.yara import services
from typing import List

router = APIRouter()

@router.post("/yara", response_model=List[YaraSchema], tags=['yara'])
def create_yara_rules(rule_text: str, db: Session = Depends(get_db)):
    yara_rule_list = services.create_yara_rules(db, rule_text)
    if yara_rule_list is None:
        raise HTTPException(400, 'Error in rule creation.')
    return yara_rule_list