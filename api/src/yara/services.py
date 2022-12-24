from sqlalchemy.orm import Session
from src.yara.models import YaraRule
from src.mitre.models import Tactic, Technique, Subtechnique
from YaraParser import MultiParser
from pydantic.schema import Optional


def create_yara_rules(db: Session, rules_text: str) -> list[YaraRule]:
    parser = MultiParser(rules_text)
    rules = parser.get_rules_dict()
    yara_rule_list = []
    #keyword_list = ['tactic', 'technique', 'subtechnique']

    for name, rule in rules.items():

        if db.query(YaraRule).filter(YaraRule.name == rule['rule_name']).scalar() is None:
        
            yara_rule = YaraRule(name = rule['rule_name'], meta = rule['rule_meta'], strings = rule['rule_strings'], conditions = rule['rule_conditions'], 
            raw_text = rule['raw_text'], logic_hash = rule['rule_logic_hash'], compiles = rule['compiles'] )

            tactic = parser.get_meta_fields(rule_meta_kvp=rule['rule_meta_kvp'], meta_keyword='tactic')
            technique = parser.get_meta_fields(rule_meta_kvp=rule['rule_meta_kvp'], meta_keyword='technique')
            subtechnique = parser.get_meta_fields(rule_meta_kvp=rule['rule_meta_kvp'], meta_keyword='subtechnique')
            author = parser.get_meta_fields(rule_meta_kvp=rule['rule_meta_kvp'], meta_keyword='author')
            description = parser.get_meta_fields(rule_meta_kvp=rule['rule_meta_kvp'], meta_keyword='description')
            
            if tactic is not None:
                tactic_db = db.query(Tactic).filter(Tactic.id == tactic).first()
                yara_rule.tactics = [tactic_db]

            if technique is not None:
                technique_db = db.query(Technique).filter(Technique.id == technique).first()
                yara_rule.techniques = [technique_db]

            if subtechnique is not None:
                subtechnique_db = db.query(Subtechnique).filter(Subtechnique.id == subtechnique).first()
                yara_rule.subtechniques = [subtechnique_db]

            if author is not None:
                yara_rule.author = author

            if description is not None:
                yara_rule.description = description
            
            db.add(yara_rule)
            db.commit()
            yara_rule_list.append(yara_rule)
        else:
            yara_rule_list.append({'msg': 'Yara rule already exists with {} name.'.format(rule['rule_name']) })

    return yara_rule_list

def get_yara_rule_name(db: Session, value: str) -> YaraRule:
    rules = db.query(YaraRule).filter(YaraRule.name.like(f'%{value}%')).all() 
    return rules
