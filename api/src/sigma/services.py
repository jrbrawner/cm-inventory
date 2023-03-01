from sqlalchemy.orm import Session
from src.sigma.models import SigmaRule
from sigma.rule import SigmaRule as _SigmaRule
from src.mitre.models import Tactic, Technique, Subtechnique
import re
import json
from datetime import datetime
from src.mitre.utils import convert_tactic
import yaml
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
from sigma.backends.elasticsearch import LuceneBackend
from sigma.collection import SigmaCollection

def create_sigma_rules(db: Session, rules_text: list) -> list[SigmaRule]:
    """Takes a list of sigma yaml strings read from files, and adds them to the database."""
    rules = list()
    sigma_rule_list = list()

    for rule in rules_text:
        sigma_rules = _SigmaRule.from_yaml(rule)
        rules.append(sigma_rules)
    
    for rule in rules:
        rule = rule.to_dict()
        rule_db = SigmaRule(
            author = rule.get('author'),
            title = rule.get('title'),
            description = rule.get('description'),
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
        if rule_db.title is not None:
            sigma_rule_list.append({'msg': f'{rule_db.title} added.', "variant": "success"})
        else: 
            sigma_rule_list.append({'msg': 'Rule with no title added.', "variant": "success"})
    db.commit()

    return sigma_rule_list

def rebuild_sigma_rule(db: Session, id: int) -> str:
    """Take id of sigma rule and return YAML representation of original rule."""
    db_rule = db.query(SigmaRule).get(id)

    rule_text = db_rule.raw_text

    return rule_text

def update_sigma_rule(db: Session, rule_text: str, id: int) -> SigmaRule:
    """Take id of sigma rule and update its db fields."""
    rule_db = db.query(SigmaRule).get(id)
    rule_db : SigmaRule
    sigma_rule = _SigmaRule.from_yaml(rule_text)
    sigma_rule = sigma_rule.to_dict()

    rule_db.author = sigma_rule.get('author')
    rule_db.title = sigma_rule.get('title')
    rule_db.description = sigma_rule.get('description')
    rule_db.logsource = json.dumps(sigma_rule.get('logsource'))
    rule_db.detection = json.dumps(sigma_rule.get('detection'))
    rule_db.condition = json.dumps(sigma_rule.get('detection').get('condition'))
    rule_db.raw_text = yaml.dump(sigma_rule)
    rule_db.date_modified = datetime.utcnow()

    tags = sigma_rule.get('tags')
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
                                rule_db.subtechniques.clear()
                                rule_db.subtechniques.append(subtechnique)
                    else:
                        if re.match(pattern_technique, keywords[1].capitalize()):
                            technique = db.query(Technique).get(keywords[1].capitalize())
                            if technique is not None:
                                rule_db.techniques.clear()
                                rule_db.techniques.append(technique)
                        tactic_name = convert_tactic(keywords[1])
                        if tactic_name is not None:
                            tactic = db.query(Tactic).filter(Tactic.name == tactic_name).first()
                            rule_db.tactics.clear()
                            rule_db.tactics.append(tactic)
    db.commit()
    return rule_db

def delete_sigma_rule(db: Session, id: int) -> dict:
    db_rule = db.query(SigmaRule).get(id)
    db.delete(db_rule)
    db.commit()
    return {'msg': f'Sigma rule with id {id} deleted.'}

def get_sigma_rule_id(db: Session, id: int) -> SigmaRule:
    return db.query(SigmaRule).get(id)

def get_sigma_rule_author(db: Session, value: str) -> Page[SigmaRule]:
    return paginate(db.query(SigmaRule).filter(SigmaRule.author.like(f"%{value}%")))

def get_sigma_rule_condition(db: Session, value: str) -> Page[SigmaRule]:
    return paginate(db.query(SigmaRule).filter(SigmaRule.condition.like(f"%{value}%")))

def get_sigma_rule_description(db: Session, value: str) -> Page[SigmaRule]:
    return paginate(db.query(SigmaRule).filter(SigmaRule.description.like(f"%{value}%")))

def get_sigma_rule_detection(db: Session, value: str) -> Page[SigmaRule]:
    return paginate(db.query(SigmaRule).filter(SigmaRule.detection.like(f"%{value}%")))

def get_sigma_rule_logsource(db: Session, value: str) -> Page[SigmaRule]:
    return paginate(db.query(SigmaRule).filter(SigmaRule.logsource.like(f"%{value}%")))

def get_sigma_rule_raw_text(db: Session, value: str) -> Page[SigmaRule]:
    return paginate(db.query(SigmaRule).filter(SigmaRule.raw_text.like(f"%{value}%")))

def get_sigma_rule_title(db: Session, value: str) -> Page[SigmaRule]:
    return paginate(db.query(SigmaRule).filter(SigmaRule.title.like(f"%{value}%")))

def get_sigma_rule_date_added(db: Session, value: str) -> Page[SigmaRule]:
    return paginate(db.query(SigmaRule).filter(SigmaRule.date_added.like(f"%{value}%")))

def get_sigma_rules_tactics(db: Session, value: str) -> Page[SigmaRule]:
    """Search for sigma rules using tactics information."""
    pattern_tactic = "[T][A][0-9][0-9][0-9][0-9]"
    if re.match(pattern_tactic, value.upper()):
        return paginate(db.query(SigmaRule).filter(SigmaRule.tactics.any(id=value.upper())))
        
    tactic_id = db.query(Tactic).filter(Tactic.name.like(f"%{value}%")).first().id
    if tactic_id is not None:
        return paginate(db.query(SigmaRule).filter(SigmaRule.tactics.any(id=tactic_id)))
    
def get_sigma_rules_techniques(db: Session, value: str) -> Page[SigmaRule]:
    """Search for sigma rules using the techniques ID field."""
    pattern_technique = "[T][0-9][0-9][0-9][0-9]"
    if re.match(pattern_technique, value.upper()):
        return paginate(db.query(SigmaRule).filter(SigmaRule.techniques.any(id=value.upper())))
        
    technique_id = db.query(Technique).filter(Technique.name.like(f"%{value}%")).first().id
    if technique_id is not None:
        return paginate(db.query(SigmaRule).filter(SigmaRule.techniques.any(id=technique_id)))
    
def get_sigma_rules_subtechniques(db: Session, value: str) -> Page[SigmaRule]:
    """Search for sigma rules using the subtechniques ID field."""
    pattern_subtechnique = "[T][0-9][0-9][0-9][0-9][.][0-9][0-9][0-9]"
    if re.match(pattern_subtechnique, value.upper()):
        return paginate(db.query(SigmaRule).filter(SigmaRule.subtechniques.any(id=value.upper())))
        
    subtechnique_id = db.query(Subtechnique).filter(Subtechnique.name.like(f"%{value}%")).first().id
    if subtechnique_id is not None:
        return paginate(db.query(SigmaRule).filter(SigmaRule.subtechniques.any(id=subtechnique_id)))
    
def create_sigma_rules_text(db: Session, rules_text: list) -> list[SigmaRule]:
    """Takes a yaml string sigma rule, parses information and adds to the database.
    WIP"""
    rules = list()
    sigma_rule_list = list()
    
    sigma_rules = _SigmaRule.from_yaml(rules_text)
    rules.append(sigma_rules)
    
    for rule in rules:
        rule = rule.to_dict()
        rule_db = SigmaRule(
            author = rule.get('author'),
            title = rule.get('title'),
            description = rule.get('description'),
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
        if rule_db.title is not None:
            sigma_rule_list.append({'msg': f'{rule_db.title} added.', "variant": "success"})
        else: 
            sigma_rule_list.append({'msg': 'Rule with no title added.', "variant": "success"})
    db.commit()

    return sigma_rule_list

def sigma_to_elasticsearch(db: Session, id: int) -> dict:
    backend = LuceneBackend()
    sigma_rule : SigmaRule
    sigma_rule = db.query(SigmaRule).get(id)
    rule = _SigmaRule.from_yaml(sigma_rule.raw_text)
    elastic_rule = backend.convert_rule(rule)
    result = {'elastic_query': elastic_rule}
    return result