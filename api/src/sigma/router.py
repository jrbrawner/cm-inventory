from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from src.sigma.schemas import SigmaBase
from sqlalchemy.orm import Session
from src.dependencies import get_db
from src.sigma import services
from typing import Union
from fastapi_pagination import Page

router = APIRouter()

@router.post("/sigma/wip", tags=["sigma"])
def create_sigma_rules(rules_text: str, db: Session = Depends(get_db)):
    
    sigma_rule_list = services.create_sigma_rules(db, rules_text)
    if sigma_rule_list is None:
        raise HTTPException(400, "Error in creating sigma rules.")
    return sigma_rule_list

@router.post("/sigma/file", response_model=list[Union[SigmaBase, dict]], tags=["sigma"])
def create_sigma_rules_file(files: list[UploadFile], db: Session = Depends(get_db)):
    rules_text = []
    for file in files:
        rules_text.append(file.file.read().decode())
    
    sigma_rule_list = services.create_sigma_rules(db, rules_text)
    if sigma_rule_list is None:
        raise HTTPException(400, "Error in creating sigma rules.")
    return sigma_rule_list

@router.get("/sigma/{id}", response_model=SigmaBase, tags=['sigma'])
def get_rule_id(id: int, db: Session = Depends(get_db)):
    rule = services.get_sigma_rule_id(db, id)
    if rule is None:
        raise HTTPException(400, 'Error in retrieving sigma rule.')
    return rule

@router.get("/sigma/rebuild/{id}", response_model=str, tags=['sigma'])
def rebuild_rule(id: int, db: Session = Depends(get_db)):
    rule_string = services.rebuild_sigma_rule(db, id)
    if rule_string is None:
        raise HTTPException(400, 'Error in rebuilding sigma rule.')
    return rule_string

@router.put("/sigma/{id}", response_model=SigmaBase, tags=['sigma'])
def update_rule(id: int, file: UploadFile, db: Session = Depends(get_db)):
    rule_text = file.file.read().decode()
    updated_rule = services.update_sigma_rule(db, rule_text, id)
    if updated_rule is None:
        raise HTTPException(400, 'Error in updating sigma rule.')
    return updated_rule

@router.delete("/sigma/{id}", response_model=dict, tags=['sigma'])
def delete_rule(id: int, db: Session = Depends(get_db)):
    deleted_rule_msg = services.delete_sigma_rule(db, id)
    if deleted_rule_msg is None:
        raise HTTPException('Error in trying to delete sigma rule.')
    return deleted_rule_msg