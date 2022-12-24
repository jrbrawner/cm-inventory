from sqlalchemy.orm import Session
from src.yara.schemas import YaraCreate
from src.yara.models import YaraRule
from src.mitre.models import Tactic, Technique, Subtechnique
from YaraParser import MultiParser
from pydantic.schema import Optional

def create_yara_rules(db: Session, rules_text: str) -> list[YaraRule]:
    parser = MultiParser(rules_text)
    rules = parser.get_rules_dict()
    yara_rule_list = []
    keyword_list = ['tactic', 'technique', 'subtechnique']

    print(rules.__len__())

    for name, rule in rules.items():

        #if db.query(YaraRule).filter(YaraRule.name == rule['rule_name']).scalar() is None:
        
        yara_rule = YaraRule(name = rule['rule_name'], meta = rule['rule_meta'], strings = rule['rule_strings'], conditions = rule['rule_conditions'], 
        raw_text = rule['raw_text'])

        tactic = parser.get_meta_fields(rule_meta_kvp=rule['rule_meta_kvp'], meta_keyword='tactic')
        technique = parser.get_meta_fields(rule_meta_kvp=rule['rule_meta_kvp'], meta_keyword='technique')
        subtechnique = parser.get_meta_fields(rule_meta_kvp=rule['rule_meta_kvp'], meta_keyword='subtechnique')

        if tactic is not None:
            tactic_db = db.query(Tactic).filter(Tactic.id == tactic).first()
            yara_rule.tactics = [tactic_db]

        if technique is not None:
            technique_db = db.query(Technique).filter(Technique.id == technique).first()
            yara_rule.techniques = [technique_db]

        if subtechnique is not None:
            subtechnique_db = db.query(Subtechnique).filter(Subtechnique.id == subtechnique).first()
            yara_rule.subtechniques = [subtechnique_db]

        db.add(yara_rule)
        db.commit()
        yara_rule_list.append(yara_rule)
        #else:
        #    yara_rule_list.append({'msg': 'Rule already exists with that name.' })

    print(yara_rule_list)
    return yara_rule_list

def get_yara_rule_name(db: Session, value: str) -> YaraRule:
    rule = db.query(YaraRule).filter(YaraRule.name.like(value)).first()
    return rule
