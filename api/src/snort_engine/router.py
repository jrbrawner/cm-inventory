from fastapi import Depends, HTTPException, APIRouter, File, UploadFile, Form
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session
from src.snort_engine import services
from src.dependencies import get_db

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

@router.get("/api/snort-engine/test-rule", response_class=PlainTextResponse, tags=['snort-engine'])
def test_rule_compilation(id: int | None = None, rule_string: str = None, db: Session = Depends(get_db)):
    """Test rule on snort engine to see if it successfuly loads."""
    result = services.test_rule(db, id, rule_string)
    if result is None:
        raise HTTPException(400, 'Error in testing snort rule.')
    return result

@router.post("/api/snort-engine/convert-rule", response_class=PlainTextResponse, tags=['snort-engine'])
def convert_rule(id: int | None = None, rule_string: str = None, db: Session = Depends(get_db)):
    result = services.convert_rule(db, id, rule_string)
    if result is None:
        raise HTTPException(400, 'Error in testing snort rule.')
    return result

@router.post("/api/snort-engine/convert-all-rules", tags=['snort-engine'])
def convert_all_broken_rules(db: Session = Depends(get_db)):
    result = services.convert_all_rules(db)
    if result is None:
        raise HTTPException(400, 'Error in testing snort rule.')
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


@router.post("/api/analyze-pcap/{id}", response_class=PlainTextResponse, tags=['snort-engine'])
def analyze_pcap_id(pcap_file: UploadFile, id: int, db: Session = Depends(get_db)):
    """Analyze a pcap using the snort rule specified with ID."""
    result = services.analyze_pcap_id(db, id, pcap_file)
    if result is None:
        raise HTTPException(400, 'Error in analyzing pcap')
    return result

@router.post("/api/analyze-pcap", response_class=PlainTextResponse, tags=['snort-engine'])
def analyze_pcap_all(pcap_file: UploadFile, db: Session = Depends(get_db)):
    """Analyze a pcap using all snort rules in db"""
    result = services.analyze_pcap_all(db,pcap_file)
    if result is None:
        raise HTTPException(400, 'Error in analyzing pcap')
    return result

@router.post("/api/analyze-pcap-detailed", response_class=PlainTextResponse, tags=['snort-engine'])
def analyze_pcap_detailed(pcap_file: UploadFile, id: int, db: Session = Depends(get_db)):
    result = services.analyze_pcap_detailed(db, id, pcap_file)
    if result is None:
        raise HTTPException(400, 'Error in analyzing pcap')
    return result