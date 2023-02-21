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

@router.get("/api/snort-engine/configuration/{name}", response_class=PlainTextResponse, tags=['snort-engine'])
def get_available_configurations(name: str):
    conf = services.get_configuration_name(name)
    if conf is None:
        raise HTTPException(400, 'Error in retrieving available configurations.')
    return conf

@router.post("/api/snort-engine/configuration", response_class=PlainTextResponse, tags=['snort-engine'])
def create_new_configuration(config_name: str, HOME_NET: str, EXTERNAL_NET: str = '!$HOME_NET'):
    result = services.create_configuration(config_name, HOME_NET, EXTERNAL_NET)
    if result is None:
        raise HTTPException(400, 'Error in creating new configuration.')
    return result

@router.post("/api/snort-engine/read-pcap", response_class=PlainTextResponse, tags=['snort-engine'])
def read_pcap(pcap_file: UploadFile):
    result = services.read_pcap(pcap_file)
    if result is None:
        raise HTTPException(400, 'Error in sending pcap file or returning result.')
    return result

@router.post("/api/read-pcap-detailed", response_class=PlainTextResponse, tags=['snort-engine'])
def read_pcap_detailed(pcap_file: UploadFile, show_raw_packet_data: bool = False):
    result = services.read_pcap_detailed(pcap_file, show_raw_packet_data)
    if result is None:
        raise HTTPException(400, 'Error in sending pcap file or returning result.')
    return result


@router.post("/api/analyze-pcap", response_class=PlainTextResponse, tags=['snort-engine'])
def analyze_pcap(pcap_file: UploadFile):
    result = services.analyze_pcap(pcap_file)
    if result is None:
        raise HTTPException(400, 'Error in analyzing pcap')
    return result