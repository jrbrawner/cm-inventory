import requests
from fastapi import UploadFile
import tempfile
from sqlalchemy.orm import Session
from src.snort.models import SnortRule
from src.snort.services import get_rule_str
from src.snort.services import update_snort_rule
import time
from src.settings import settings

snort_url = settings.SNORT_ENGINE_URL

def check_status() -> dict:
    """Check if snort engine is running."""
    #try:
    status = requests.get(f'http://127.0.0.1:5000/version', verify=False)
    return {'result': 'live', 'variant': 'success'}
    #except:
    #    status = requests.get(f'http://127.0.0.1:5000/version'
    #                          )
    #    return {'result': 'down', 'variant': 'danger'}

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
    rule = db.query(SnortRule).get(id)
    params = {'rule_string': rule.raw_text}
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
    rule = db.query(SnortRule).get(id)
    params = {'rule_string': rule.raw_text}
    result = requests.post(f"{snort_url}/snort2lua/convert-rule",
                          params=params)
    return result.content

def convert_all_rules(db: Session):
    """Check all rules and if there is an error, convert the rule and save it in db.\n
       NOTE: This will likely take quite a while to execute depending on the amount of rules in db.
    """
    st = time.time()
    rules = db.query(SnortRule).all()
    rule_list = []
    updated_list = []
    for rule in rules:
        test_result = test_rule(db, 1, rule_string=rule.raw_text)
        if "Rule loaded successfully." not in str(test_result):
            rule_list.append({'id': rule.id, 'result' : test_result, 'rule_string': rule.raw_text})
    
    for entry in rule_list:
        new_rule_string = convert_rule(db, 0, rule_string=entry['rule_string'])
        result = update_snort_rule(db, entry['id'], new_rule_string.decode())
        if result is not None:
            updated_list.append({'id': result.id, 'updated_string': result.raw_text})
        if result is None:
            updated_list.append({'id': entry['id'], 'updated_string': 'Cant be updated, check snort.rej'})
    et = time.time()
    print(f'Finished, execution time - {et - st}')
    return updated_list
    
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
    rule = db.query(SnortRule).get(id)
    f = open(temp_file_rules.name, 'w')
    f.write(rule.raw_text)

    contents = pcap_file.file.read()
    files = {'pcap_file': ('pcap_file', contents), 'rules_file': ('rules_file', temp_file_rules)}
    f.close()

    result = requests.post(f"{snort_url}/analyze-pcap",
                           files=files)
    
    return result.content

def analyze_pcap_input(pcap_file: UploadFile, rules_text: str) -> str:
    temp_file_rules = tempfile.NamedTemporaryFile(delete=False)
    f = open(temp_file_rules.name, 'w')
    f.write(rules_text)

    contents = pcap_file.file.read()
    files = {'pcap_file': ('pcap_file', contents), 'rules_file': ('rules_file', temp_file_rules)}
    f.close()

    result = requests.post(f"{snort_url}/analyze-pcap",
                           files=files)
    
    return result.content
    

def analyze_pcap_all(db: Session, pcap_file: UploadFile) -> str:
    """Send a pcap file to snort engine and use all rules to analyze it."""
    temp_file_rules = tempfile.NamedTemporaryFile(delete=False)
    rules = db.query(SnortRule).all()
    f = open(temp_file_rules.name, 'w')
    for rule in rules:
        f.write(rule.raw_text + '\n')
    contents = pcap_file.file.read()
    files = {'pcap_file': ('pcap_file', contents), 'rules_file': ('rules_file', temp_file_rules)}
    f.close()

    result = requests.post(f"{snort_url}/analyze-pcap",
                           files=files)
    
    return result.content

def analyze_pcap_detailed(db: Session, id: int, pcap_file: UploadFile) -> str:
    temp_file_rules = tempfile.NamedTemporaryFile(delete=False)
    rule = db.query(SnortRule).get(id)
    rule_string = get_rule_str(rule=rule)
    f = open(temp_file_rules.name, 'w')
    f.write(rule_string)

    contents = pcap_file.file.read()
    files = {'pcap_file': ('pcap_file', contents), 'rules_file': ('rules_file', temp_file_rules)}
    f.close()

    result = requests.post(f"{snort_url}/analyze-pcap-detailed",
                           files=files)
    
    return result.content

