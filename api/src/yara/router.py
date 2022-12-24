from fastapi import APIRouter, HTTPException, Depends
from src.yara.schemas import YaraSchema, YaraCreate
from sqlalchemy.orm import Session
from src.dependencies import get_db, get_current_user
from src.yara import services
from src.yara.constants import YaraRuleFieldSearch

router = APIRouter()

@router.post("/yara", response_model=list[YaraCreate], tags=['yara'])
def create_yara_rules(rules_text: str, db: Session = Depends(get_db)):
    yara_rule_list = services.create_yara_rules(db, rules_text)
    if yara_rule_list is None:
        raise HTTPException(400, 'Error in rule creation.')
    return yara_rule_list

@router.get("/yara/{field}/{value}", response_model=list[YaraSchema], tags=['yara'])
def get_yara_rule(field: YaraRuleFieldSearch, value:str,  db: Session = Depends(get_db)):
    if field is YaraRuleFieldSearch.Name:
        yara_rules = services.get_yara_rule_name(db, value)
        if yara_rules is None:
            raise HTTPException(404, 'No rule found with searching for that field with that value.')
        return yara_rules