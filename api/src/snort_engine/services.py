import requests
from fastapi import UploadFile
import tempfile
from sqlalchemy.orm import Session
from src.snort.models import SnortRule
from src.snort.services import get_rule_str

snort_url = 'https://jrbrawner-vigilant-space-broccoli-qg9qw4vg5gghx4rr-80.preview.app.github.dev'

def get_available_configurations() -> str:
    """Display available configurations from Snort Engine."""
    conf = requests.get(f'{snort_url}/configuration')
    return conf.content

def get_configuration_name(name: str) -> str:
    """Display configuration text from specified file."""
    conf = requests.get(f'{snort_url}/configuration/{name}')
    return conf.content

def create_configuration(config_name: str, HOME_NET: str, EXTERNAL_NET: str) -> str:
    """Create a new configuration based on provided parameters."""
    params = {"config_name": config_name, "HOME_NET": HOME_NET, "EXTERNAL_NET": EXTERNAL_NET}
    configuration = requests.post(url=f"{snort_url}/configuration",
                                  params=params)
    
    return configuration.content

def test_rule(db: Session, id: int, rule_string: str) -> str:
    """Load rule on snort engine to ensure it compiles successfully."""
    if rule_string is not None:
        params = {'rule_string': rule_string}
        result = requests.get(f"{snort_url}/test-rule",
                                params=params)
        return result.content 
    rule = get_rule_str(db, id)
    params = {'rule_string': rule}
    result = requests.get(f"{snort_url}/test-rule",
                          params=params)
    return result.content

def convert_rule(db: Session, id: int, rule_string: str) -> str:
    """Convert a snort2 rule to snort3."""
    if rule_string is not None:
        params = {'rule_string': rule_string}
        result = requests.post(f"{snort_url}/snort2lua/convert-rule",
                                params=params)
        return result.content
    rule = get_rule_str(db, id)
    params = {'rule_string': rule}
    result = requests.post(f"{snort_url}/snort2lua/convert-rule",
                          params=params)
    return result.content

def convert_all_rules(db: Session):
    """Check all rules and if there is an error, convert the rule and save it in db."""
    rules = db.query(SnortRule).all()
    rule_list = []
    for rule in rules:
        string = get_rule_str(rule=rule)
        test_result = test_rule(db, 1, rule_string=string)
        if test_result != "Rule loaded successfully.":
            rule_list.append({rule.id : test_result})
    return rule_list
    


def read_pcap(pcap_file: UploadFile) -> str:
    """Send a pcap file to snort engine to inspect and display the result."""
    contents = pcap_file.file.read()
    files = {'pcap_file': ('pcap_file', contents)}
    result = requests.post(f"{snort_url}/read-pcap",
                           files=files)
    return result.content

def read_pcap_detailed(pcap_file: UploadFile, show_raw_packet_data: bool) -> str:
    """Send a pcap file to snort engine to inspect and display the result, packet by packet."""
    contents = pcap_file.file.read()
    files = {'pcap_file': ('pcap_file', contents)}
    params = {"show_raw_packet_data": show_raw_packet_data}
    result = requests.post(f"{snort_url}/read-pcap-detailed",
                           files=files,
                           params=params)
    
    return result.content

def analyze_pcap_id(db: Session, id: int, pcap_file: UploadFile) -> str:
    """Send a pcap file to snort engine and specify rule by id to inspect the pcap file."""
    temp_file_rules = tempfile.NamedTemporaryFile(delete=False)
    rule = get_rule_str(db, id)
    print(rule)
    f = open(temp_file_rules.name, 'w')
    f.write(rule)

    contents = pcap_file.file.read()
    files = {'pcap_file': ('pcap_file', contents), 'rules_file': ('rules_file', temp_file_rules)}
    f.close()

    result = requests.post(f"{snort_url}/analyze-pcap",
                           files=files)
    
    return result.content

def analyze_pcap_all(db: Session, pcap_file: UploadFile) -> str:
    """Send a pcap file to snort engine and specify rule by id to inspect the pcap file."""
    temp_file_rules = tempfile.NamedTemporaryFile(delete=False)
    rules = db.query(SnortRule).all()
    f = open(temp_file_rules.name, 'w')
    for rule in rules:
        f.writelines(get_rule_str(rule=rule))

    contents = pcap_file.file.read()
    files = {'pcap_file': ('pcap_file', contents), 'rules_file': ('rules_file', temp_file_rules)}
    f.close()

    result = requests.post(f"{snort_url}/analyze-pcap",
                           files=files)
    
    return result.content

def analyze_pcap_detailed(pcap_file: UploadFile) -> str:
    temp_file_rules = tempfile.NamedTemporaryFile(delete=False)
    rules = 'alert tcp any any -> any any (msg:"This is a test";) '
    f = open(temp_file_rules.name, 'w')
    f.write(rules)

    contents = pcap_file.file.read()
    files = {'pcap_file': ('pcap_file', contents), 'rules_file': ('rules_file', temp_file_rules)}
    f.close()

    result = requests.post(f"{snort_url}/analyze-pcap",
                           files=files)
    
    return result.content

