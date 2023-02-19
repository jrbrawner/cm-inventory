from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from src.sigma.schemas import SigmaSchema
from sqlalchemy.orm import Session
from src.dependencies import get_db
from src.sigma import services
from typing import Union
from fastapi_pagination import Page
from src.sigma.constants import SigmaRuleFieldSearch

router = APIRouter()

@router.post("/api/sigma", response_model=list[Union[SigmaSchema, dict]], tags=["sigma"])
def create_sigma_rules(rules_text: str = Form(), db: Session = Depends(get_db)):
    
    sigma_rule_list = services.create_sigma_rules_text(db, rules_text)
    if sigma_rule_list is None:
        raise HTTPException(400, "Error in creating sigma rules.")
    return sigma_rule_list

@router.post("/api/sigma/file", response_model=list[Union[SigmaSchema, dict]], tags=["sigma"])
def create_sigma_rules_file(files: list[UploadFile], db: Session = Depends(get_db)):
    rules_text = []
    for file in files:
        rules_text.append(file.file.read().decode())
    
    sigma_rule_list = services.create_sigma_rules(db, rules_text)
    if sigma_rule_list is None:
        raise HTTPException(400, "Error in creating sigma rules.")
    return sigma_rule_list

@router.get("/api/sigma/{field}/{value}", response_model=Page[SigmaSchema], tags=["sigma"])
def sigma_rules_search(
    field: SigmaRuleFieldSearch, value: str, db: Session = Depends(get_db)
):
    if field is SigmaRuleFieldSearch.Author:
        sigma_rule_list = services.get_sigma_rule_author(db, value)
        if sigma_rule_list is None:
            raise HTTPException(
                404, "No sigma rules found for that field with that value."
            )
        return sigma_rule_list
    if field is SigmaRuleFieldSearch.Condition:
        sigma_rule_list = services.get_sigma_rule_condition(db, value)
        if sigma_rule_list is None:
            raise HTTPException(
                404, "No sigma rules found for that field with that value."
            )
        return sigma_rule_list
    if field is SigmaRuleFieldSearch.Description:
        sigma_rule_list = services.get_sigma_rule_description(db, value)
        if sigma_rule_list is None:
            raise HTTPException(
                404, "No sigma rules found for that field with that value."
            )
        return sigma_rule_list
    if field is SigmaRuleFieldSearch.Detection:
        sigma_rule_list = services.get_sigma_rule_detection(db, value)
        if sigma_rule_list is None:
            raise HTTPException(
                404, "No sigma rules found for that field with that value."
            )
        return sigma_rule_list
    if field is SigmaRuleFieldSearch.Logsource:
        sigma_rule_list = services.get_sigma_rule_logsource(db, value)
        if sigma_rule_list is None:
            raise HTTPException(
                404, "No sigma rules found for that field with that value."
            )
        return sigma_rule_list
    if field is SigmaRuleFieldSearch.Raw_Text:
        sigma_rule_list = services.get_sigma_rule_raw_text(db, value)
        if sigma_rule_list is None:
            raise HTTPException(
                404, "No sigma rules found for that field with that value."
            )
        return sigma_rule_list
    if field is SigmaRuleFieldSearch.Title:
        sigma_rule_list = services.get_sigma_rule_title(db, value)
        if sigma_rule_list is None:
            raise HTTPException(
                404, "No sigma rules found for that field with that value."
            )
        return sigma_rule_list
    if field is SigmaRuleFieldSearch.Date_Added:
        sigma_rule_list = services.get_sigma_rule_date_added(db, value)
        if sigma_rule_list is None:
            raise HTTPException(
                404, "No sigma rules found for that field with that value."
            )
        return sigma_rule_list
    if field is SigmaRuleFieldSearch.Tactics:
        sigma_rule_list = services.get_sigma_rules_tactics(db, value)
        if sigma_rule_list is None:
            raise HTTPException(
                404, "No sigma rules found for that field with that value."
            )
        return sigma_rule_list
    if field is SigmaRuleFieldSearch.Techniques:
        sigma_rule_list = services.get_sigma_rules_techniques(db, value)
        if sigma_rule_list is None:
            raise HTTPException(
                404, "No sigma rules found for that field with that value."
            )
        return sigma_rule_list
    if field is SigmaRuleFieldSearch.Subtechniques:
        sigma_rule_list = services.get_sigma_rules_techniques(db, value)
        if sigma_rule_list is None:
            raise HTTPException(
                404, "No sigma rules found for that field with that value."
            )
        return sigma_rule_list
    
@router.get("/api/sigma/{id}", response_model=SigmaSchema, tags=['sigma'])
def get_rule_id(id: int, db: Session = Depends(get_db)):
    rule = services.get_sigma_rule_id(db, id)
    if rule is None:
        raise HTTPException(400, 'Error in retrieving sigma rule.')
    return rule

@router.get("/api/sigma/rebuild/{id}", response_model=str, tags=['sigma'])
def rebuild_rule(id: int, db: Session = Depends(get_db)):
    rule_string = services.rebuild_sigma_rule(db, id)
    if rule_string is None:
        raise HTTPException(400, 'Error in rebuilding sigma rule.')
    return rule_string

@router.put("/api/sigma/{id}", response_model=SigmaSchema, tags=['sigma'])
def update_rule(id: int, rule_text: str = Form(), db: Session = Depends(get_db)):
    updated_rule = services.update_sigma_rule(db, rule_text, id)
    if updated_rule is None:
        raise HTTPException(400, 'Error in updating sigma rule.')
    return updated_rule

@router.delete("/api/sigma/{id}", response_model=dict, tags=['sigma'])
def delete_rule(id: int, db: Session = Depends(get_db)):
    deleted_rule_msg = services.delete_sigma_rule(db, id)
    if deleted_rule_msg is None:
        raise HTTPException('Error in trying to delete sigma rule.')
    return deleted_rule_msg