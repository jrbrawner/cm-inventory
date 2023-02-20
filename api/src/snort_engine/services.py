import requests

snort_url = 'https://jrbrawner-vigilant-space-broccoli-qg9qw4vg5gghx4rr-80.preview.app.github.dev'

def get_available_configurations():
    conf = requests.get(f'{snort_url}/configuration').content
    
    return conf

def create_configuration(config_name: str, HOME_NET: str, EXTERNAL_NET: str):
    request_data = {"config_name": config_name, "HOME_NET": HOME_NET, "EXTERNAL_NET": EXTERNAL_NET}
    configuration = requests.post(url=f"{snort_url}/configuration",
                                  data=request_data)