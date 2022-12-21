from sqlalchemy.orm import Session
from src.yara.schemas import YaraCreate
from src.yara.models import YaraRule
from YaraParser import MultiParser


def create_yara_rules(db: Session, rule_text: str):
    parser = MultiParser(rule_text)
    rules = parser.get_rules_dict()
    keyword_list = ['tactic', 'technique', 'subtechnique']
    yara_rule_list = []

    for name, rule in rules.items():
        keyword_values = parser.get_meta_fields(rule['rule_meta_kvp'], meta_keyword_list=keyword_list)
        yara_rule = YaraRule(name = rule['rule_name'], meta = rule['rule_meta'], strings = rule['rule_strings'], conditions = rule['rule_conditions'], 
        raw_text = rule['raw_text'], tactic = keyword_values[0], technique = keyword_values[1], subtechnique = keyword_values[2])
        db.add(yara_rule)
        db.commit()
        yara_rule_list.append(yara_rule)
    return yara_rule_list
