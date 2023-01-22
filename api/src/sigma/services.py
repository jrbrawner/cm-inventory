from sqlalchemy.orm import Session
from src.sigma.models import SigmaRule
from sigma.rule import SigmaRule as _SigmaRule
from sigma.collection import SigmaCollection
from src.mitre.models import Tactic, Technique, Subtechnique
import re
import json
from src.mitre.utils import convert_tactic
import yaml

def create_sigma_rules(db: Session, rules_text: str) -> list[SigmaRule]:

    rules = SigmaCollection.from_yaml(rules_text)

    sigma_rule_list = list()

    for rule in rules:
        rule = rule.to_dict()

        rule_db = SigmaRule(
            author = rule.get('author'),
            logsource = json.dumps(rule.get('logsource')),
            detection = json.dumps(rule.get('detection')),
            condition = json.dumps(rule.get('detection').get('condition')),
            raw_text = yaml.dump(rule)
        )
        
        tags = rule.get('tags')

        pattern_subtechnique = "[T][0-9][0-9][0-9][0-9].[0-9][0-9][0-9]"
        pattern_technique = "[T][0-9][0-9][0-9][0-9]"

        if tags is not None:
            for tag in tags:
                keywords = tag.split('.')
                if keywords[0] == 'attack':
                    if len(keywords) == 3:
                        subtechnique_id = keywords[1].capitalize() + "." + keywords[2]
                        if re.match(pattern_subtechnique, subtechnique_id):
                            subtechnique = db.query(Subtechnique).get(subtechnique_id)
                            if subtechnique is not None:
                                rule_db.subtechniques.append(subtechnique)
                    else:
                        if re.match(pattern_technique, keywords[1].capitalize()):
                            technique = db.query(Technique).get(keywords[1].capitalize())
                            if technique is not None:
                                rule_db.techniques.append(technique)
                        tactic_name = convert_tactic(keywords[1])
                        if tactic_name is not None:
                            tactic = db.query(Tactic).filter(Tactic.name == tactic_name).first()
                            rule_db.tactics.append(tactic)
        db.add(rule_db)
        sigma_rule_list.append(rule_db)
    db.commit()

    return sigma_rule_list

def rebuild_rule(db: Session, id: int) -> str:
    """Take id of sigma rule and return YAML representation of original rule."""
    db_rule = db.query(SigmaRule).get(id)

    rule_text = db_rule.raw_text

    return rule_text