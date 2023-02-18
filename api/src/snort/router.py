from fastapi import Depends, HTTPException, APIRouter, File, UploadFile, Form
from src.snort.schemas import SnortSchema
from sqlalchemy.orm import Session
from src.dependencies import get_db
from src.snort import services
from src.snort.constants import SnortRuleFieldSearch
from typing import Union
from fastapi_pagination import Page

router = APIRouter()

@router.post("/snort", response_model=list[Union[SnortSchema, dict]], tags=["snort"])
def create_snort_rules(rules_text: str = Form(), db: Session = Depends(get_db)):
    snort_rules_list = services.create_snort_rules(db, rules_text)
    if snort_rules_list is None:
        raise HTTPException(400, "Error in creating rules.")
    return snort_rules_list

@router.post(
    "/snort/file", response_model=list[Union[SnortSchema, dict]], tags=["snort"]
)
def create_snort_rules_file(files: list[UploadFile], db: Session = Depends(get_db)):
    rules_text = []
    for file in files:
        rules_text.append(file.file.read().decode())
    
    snort_rules_list = services.create_snort_rules(db, file_text=rules_text)
    if snort_rules_list is None:
        raise HTTPException(400, "Error in creating rules.")
    return snort_rules_list

@router.get("/snort/deconstruct/{id}", response_model=dict, tags=['snort'])
def deconstruct_snort_rule(id: int, db: Session = Depends(get_db)) -> dict:
    msg = services.deconstruct_snort_rule_id(db, id)
    if msg is None:
        raise HTTPException(400, 'Error in deconstructing rule.')
    return msg

@router.get("/snort/rebuild/{id}", response_model=str, tags=["snort"])
def rebuild_rule(id: int, db: Session = Depends(get_db)) -> str:
    str_rule = services.get_rule_str(db, id)
    if str_rule is None:
        raise HTTPException(400, "Error in retrieving string of that rule.")
    return str_rule

@router.get("/snort/{field}/{value}", response_model=Page[SnortSchema], tags=["snort"])
def get_snort_rules(
    field: SnortRuleFieldSearch, value: str, db: Session = Depends(get_db)
):
    if field is SnortRuleFieldSearch.Action:
        snort_rules_list = services.get_snort_rule_action(db, value)
        if snort_rules_list is None:
            raise HTTPException(
                404, "No snort rules found for that field with that value."
            )
        return snort_rules_list
    if field is SnortRuleFieldSearch.Protocol:
        snort_rules_list = services.get_snort_rule_protocol(db, value)
        if snort_rules_list is None:
            raise HTTPException(
                404, "No snort rules found for that field with that value."
            )
        return snort_rules_list
    if field is SnortRuleFieldSearch.Src_IP:
        snort_rules_list = services.get_snort_rule_src_ip(db, value)
        if snort_rules_list is None:
            raise HTTPException(
                404, "No snort rules found for that field with that value."
            )
        return snort_rules_list
    if field is SnortRuleFieldSearch.Src_Port:
        snort_rules_list = services.get_snort_rule_src_port(db, value)
        if snort_rules_list is None:
            raise HTTPException(
                404, "No snort rules found for that field with that value."
            )
        return snort_rules_list
    if field is SnortRuleFieldSearch.Direction:
        snort_rules_list = services.get_snort_rule_direction(db, value)
        if snort_rules_list is None:
            raise HTTPException(
                404, "No snort rules found for that field with that value."
            )
        return snort_rules_list
    if field is SnortRuleFieldSearch.Dst_IP:
        snort_rules_list = services.get_snort_rule_dst_ip(db, value)
        if snort_rules_list is None:
            raise HTTPException(
                404, "No snort rules found for that field with that value."
            )
        return snort_rules_list
    if field is SnortRuleFieldSearch.Dst_Port:
        snort_rules_list = services.get_snort_rule_dst_port(db, value)
        if snort_rules_list is None:
            raise HTTPException(
                404, "No snort rules found for that field with that value."
            )
        return snort_rules_list
    if field is SnortRuleFieldSearch.Body_Options:
        snort_rules_list = services.get_snort_rule_body_options(db, value)
        if snort_rules_list is None:
            raise HTTPException(
                404, "No snort rules found for that field with that value."
            )
        return snort_rules_list
    if field is SnortRuleFieldSearch.Tactics:
        snort_rules_list = services.get_snort_rules_tactics(db, value)
        if snort_rules_list is None:
            raise HTTPException(
                404, "No snort rules found for that field with that value."
            )
        return snort_rules_list
    if field is SnortRuleFieldSearch.Tactics:
        snort_rules_list = services.get_snort_rules_tactics(db, value)
        if snort_rules_list is None:
            raise HTTPException(
                404, "No snort rules found for that field with that value."
            )
        return snort_rules_list
    if field is SnortRuleFieldSearch.Techniques:
        snort_rules_list = services.get_snort_rules_techniques(db, value)
        if snort_rules_list is None:
            raise HTTPException(
                404, "No snort rules found for that field with that value."
            )
        return snort_rules_list
    if field is SnortRuleFieldSearch.Subtechniques:
        snort_rules_list = services.get_snort_rules_subtechniques(db, value)
        if snort_rules_list is None:
            raise HTTPException(
                404, "No snort rules found for that field with that value."
            )
        return snort_rules_list
    

@router.get("/snort/{id}", response_model=SnortSchema, tags=['snort'])
def get_snort_rule(id: int, db: Session = Depends(get_db)):
    rule = services.get_snort_rule_id(db, id)
    if rule is None:
        raise HTTPException(400, 'Error in retrieving rule.')
    return rule

@router.put("/snort/{id}", response_model=SnortSchema, tags=["snort"])
def update_snort_rule(
    id: int, rule_text: str = Form(), db: Session = Depends(get_db)
) -> SnortSchema:
    updated_rule = services.update_snort_rule(db, id, rule_text)
    if updated_rule is None:
        raise HTTPException(404, "Error in updating rule.")
    return updated_rule


@router.delete("/snort/{id}", response_model=dict, tags=["snort"])
def delete_snort_rule(id: int, db: Session = Depends(get_db)) -> dict:
    msg = services.delete_snort_rule(db, id)
    if msg is None:
        raise HTTPException(400, "Error in deleting rule.")
    return msg

@router.post("/snort/test", response_model=dict, tags=['snort'])
def test_snort_rule(rule_string: str = Form()) -> dict:
    msg = services.test_snort_rule(rule_string)
    if msg is None:
        raise HTTPException(400, 'Error in testing rule.')
    return msg

@router.post("/snort/deconstruct", response_model=dict, tags=['snort'])
def deconstruct_snort_rule(rule_string: str = Form()) -> dict:
    msg = services.deconstruct_snort_rule(rule_string)
    if msg is None:
        raise HTTPException(400, 'Error in deconstructing rule.')
    return msg



