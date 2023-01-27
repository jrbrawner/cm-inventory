from fastapi import APIRouter, HTTPException, Depends, File, UploadFile, Form
from src.yara.schemas import YaraSchema
from sqlalchemy.orm import Session
from src.dependencies import get_db, get_current_user
from src.yara import services
from src.yara.constants import YaraRuleFieldSearch
from typing import Union
import time

router = APIRouter()

@router.post("/yara", response_model=list[Union[YaraSchema, dict]], tags=["yara"])
def create_yara_rules(rules_text: str = Form(), db: Session = Depends(get_db)):
    
    yara_rule_list = services.create_yara_rules(db, rules_text)
    if yara_rule_list is None:
        raise HTTPException(400, "Error in rule creation.")
    return yara_rule_list


@router.post("/yara/file", response_model=list[Union[YaraSchema, dict]], tags=["yara"])
def create_yara_rules_file(file: UploadFile, db: Session = Depends(get_db)):
    rules_text = file.file.read().decode()
    yara_rule_list = services.create_yara_rules(db, rules_text)
    if yara_rule_list is None:
        raise HTTPException(400, "Error in rule creation.")
    return yara_rule_list


@router.get("/yara/{field}/{value}", response_model=list[YaraSchema], tags=["yara"])
def get_yara_rule(
    field: YaraRuleFieldSearch, value: str, db: Session = Depends(get_db)
):
    if field is YaraRuleFieldSearch.Name:
        yara_rules = services.get_yara_rules_name(db, value)
        if yara_rules is None:
            raise HTTPException(
                404, "No rules found searching for that field with that value."
            )
        return yara_rules
    if field is YaraRuleFieldSearch.Meta:
        yara_rules = services.get_yara_rules_meta(db, value)
        if yara_rules is None:
            raise HTTPException(
                404, "No rules found searching for that field with that value."
            )
        return yara_rules
    if field is YaraRuleFieldSearch.Strings:
        yara_rules = services.get_yara_rules_strings(db, value)
        if yara_rules is None:
            raise HTTPException(
                404, "No rules found searching for that field with that value."
            )
        return yara_rules
    if field is YaraRuleFieldSearch.Conditions:
        yara_rules = services.get_yara_rules_conditions(db, value)
        if yara_rules is None:
            raise HTTPException(
                404, "No rules found searching for that field with that value."
            )
        return yara_rules
    if field is YaraRuleFieldSearch.Logic_Hash:
        yara_rules = services.get_yara_rules_logic_hash(db, value)
        if yara_rules is None:
            raise HTTPException(
                404, "No rules found searching for that field with that value."
            )
        return yara_rules
    if field is YaraRuleFieldSearch.Author:
        yara_rules = services.get_yara_rules_author(db, value)
        if yara_rules is None:
            raise HTTPException(
                404, "No rules found searching for that field with that value."
            )
        return yara_rules
    if field is YaraRuleFieldSearch.Date_Added:
        yara_rules = services.get_yara_rules_date_added(db, value)
        if yara_rules is None:
            raise HTTPException(
                404, "No rules found searching for that field with that value."
            )
        return yara_rules
    if field is YaraRuleFieldSearch.Compiles:
        yara_rules = services.get_yara_rules_compiles(db, value)
        if yara_rules is None:
            raise HTTPException(
                404, "No rules found searching for that field with that value."
            )
        return yara_rules
    if field is YaraRuleFieldSearch.Tactics:
        yara_rules = services.get_yara_rules_tactics(db, value)
        if yara_rules is None:
            raise HTTPException(
                404, "No rules found searching for that field with that value."
            )
        return yara_rules
    if field is YaraRuleFieldSearch.Techniques:
        yara_rules = services.get_yara_rules_techniques(db, value)
        if yara_rules is None:
            raise HTTPException(
                404, "No rules found searching for that field with that value."
            )
        return yara_rules
    if field is YaraRuleFieldSearch.Subtechniques:
        yara_rules = services.get_yara_rules_subtechniques(db, value)
        if yara_rules is None:
            raise HTTPException(
                404, "No rules found searching for that field with that value."
            )
        return yara_rules

@router.get("/yara/{id}", response_model=YaraSchema, tags=["yara"])
def get_yara_rule(id: int, db: Session = Depends(get_db)):
    yara_rule = services.get_yara_rule(db, id)
    if yara_rule is None:
        raise HTTPException(404, 'No yara rule found with that id.')
    return yara_rule

@router.put("/yara/{id}", response_model=Union[YaraSchema, dict], tags=["yara"])
def update_yara_rule(
    id: int, rule_text: str = Form(), db: Session = Depends(get_db)
) -> YaraSchema:
    updated_rule = services.update_yara_rule(db, id, rule_text)
    if updated_rule is None:
        raise HTTPException(400, updated_rule)
    return updated_rule


@router.delete("/yara/{id}", response_model=dict, tags=["yara"])
def delete_yara_rule(id: int, db: Session = Depends(get_db)) -> dict:
    msg = services.delete_yara_rule(db, id)
    if msg is None:
        raise HTTPException(400, "Error")
    return msg
