import requests
from fastapi import UploadFile
import tempfile

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

def read_pcap(pcap_file: UploadFile) -> str:
    """Send a pcap file to snort engine to inspect and display the return the result."""
    contents = pcap_file.file.read()
    files = {'pcap_file': ('pcap_file', contents)}
    result = requests.post(f"{snort_url}/read-pcap",
                           files=files)
    return result.content

def read_pcap_detailed(pcap_file: UploadFile, show_raw_packet_data: bool) -> str:
    contents = pcap_file.file.read()
    files = {'pcap_file': ('pcap_file', contents)}
    params = {"show_raw_packet_data": show_raw_packet_data}
    result = requests.post(f"{snort_url}/read-pcap-detailed",
                           files=files,
                           params=params)
    
    return result.content

def analyze_pcap(pcap_file: UploadFile) -> str:
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