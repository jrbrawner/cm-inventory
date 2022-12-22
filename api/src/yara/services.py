from sqlalchemy.orm import Session
from src.yara.schemas import YaraCreate
from src.yara.models import YaraRule
from src.mitre.models import Tactic
from YaraParser import MultiParser
from typing import List


def create_yara_rules(db: Session, rule_text: str) -> List[YaraRule]:
    parser = MultiParser(rule_text)
    rules = parser.get_rules_dict()
    yara_rule_list = []

    for name, rule in rules.items():
        yara_rule = YaraRule(name = rule['rule_name'], meta = rule['rule_meta'], strings = rule['rule_strings'], conditions = rule['rule_conditions'], 
        raw_text = rule['raw_text'])
        #technique = parser.get_meta_fields(rule_meta_kvp=rule['rule_meta_kvp'], meta_keyword='technique'),
        #subtechnique = parser.get_meta_fields(rule_meta_kvp=rule['rule_meta_kvp'], meta_keyword='tactic'))
        tactic = parser.get_meta_fields(rule_meta_kvp=rule['rule_meta_kvp'], meta_keyword='tactic')
        if tactic is not None:
            tactic_db = db.query(Tactic).filter(Tactic.id == tactic).first()
            yara_rule.tactic.append(tactic_db)
        db.add(yara_rule)
        db.commit()
        yara_rule_list.append(yara_rule)
    return yara_rule_list

def get_yara_rule_name(db: Session, value: str) -> YaraRule:
    rule: YaraRule
    tactic: Tactic
    rule = db.query(YaraRule).filter(YaraRule.name.like(value)).first()
    tactic = db.query(Tactic).filter(Tactic.id == 'TA0002').first()
    print(rule.tactic)
    print(tactic.yara_rules)
    return rule
