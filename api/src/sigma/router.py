from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from src.sigma.schemas import SigmaBase
from sqlalchemy.orm import Session
from src.dependencies import get_db
from src.sigma import services

router = APIRouter()


@router.post("/sigma", tags=["sigma"])
def create_sigma_rules(rules_text: str, db: Session = Depends(get_db)):
    sigma_rule_list = services.create_sigma_rules(db, rules_text)
    if sigma_rule_list is None:
        raise HTTPException(400, "Error in creating sigma rules.")
    return sigma_rule_list


@router.post("/sigma/file", response_model=list[SigmaBase], tags=["sigma"])
def create_sigma_rules_file(file: UploadFile, db: Session = Depends(get_db)):
    rules_text = file.file.read().decode()
    sigma_rule_list = services.create_sigma_test(db, rules_text)
    if sigma_rule_list is None:
        raise HTTPException(400, "Error in creating sigma rules.")
    return sigma_rule_list
