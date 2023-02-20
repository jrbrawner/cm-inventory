from fastapi import Depends, HTTPException, APIRouter, File, UploadFile, Form
from fastapi.responses import PlainTextResponse
import requests
from src.snort_engine import services

router = APIRouter()

@router.get("/api/snort-engine/configuration", response_class=PlainTextResponse, tags=['snort-engine'])
def get_available_configurations():
    conf = services.get_available_configurations()
    if conf is None:
        raise HTTPException(400, 'Error in retrieving available configurations.')
    return conf

@router.post("/api/snort-engine/configuration", response_class=PlainTextResponse, tags=['snort-engine'])
def create_new_configuration(config_name: str, HOME_NET: str, EXTERNAL_NET: str = '!$HOME_NET'):
    result = services.create_configuration(config_name, HOME_NET, EXTERNAL_NET)
    if result is None:
        raise HTTPException(400, 'Error in creating new configuration.')
    return result