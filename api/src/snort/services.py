from sqlalchemy.orm import Session
from src.snort.models import SnortRule
from SRParser import SnortParser
from src.mitre.models import Tactic, Technique, Subtechnique
import json

def create_snort_rules(db: Session, rules_text: str) -> list[SnortRule]:
    """Method for parsing and creating snort rules."""
    parser = SnortParser()
    snort_rule_list = []
    rules = parser.parse_rules(rules_text)
    for rule in rules:
    
        rule_options = json.dumps(rule.body_options)
        db_rule = SnortRule(
            action=rule.action,
            protocol=rule.protocol,
            src_ip=rule.source_ip,
            src_port=rule.source_port,
            direction=rule.direction,
            dst_ip=rule.dest_ip,
            dst_port=rule.dest_port,
            body_options=rule_options
        )

        #checking for mitre att&ck designations in rem option
        if 'rem' in str(rule.body_options):
            for option in rule.body_options:
                for key, value in option.items():
                    if key == 'rem':
                        value = value.replace('"', '')
                        mitre = value.split(',')
                        for i in mitre:
                            opts = i.split(':')
                            if opts[0].strip() == 'tactic':
                                tactic_db = db.query(Tactic).get(opts[1])
                                db_rule.tactics.append(tactic_db)
                            if opts[0].strip() == 'technique':
                                technique_db = db.query(Technique).get(opts[1])
                                db_rule.techniques.append(technique_db)
                            if opts[0].strip() == 'subtechnique':
                                subtechnique_db = db.query(Subtechnique).get(opts[1])
                                db_rule.subtechniques.append(subtechnique_db)
                        
        db.add(db_rule)
        snort_rule_list.append(db_rule)
    db.commit()

    for i in parser.error_log:
        error_msg = {'msg': i}
        snort_rule_list.append(error_msg)

    if len(snort_rule_list) > 100:
        error_msg = f'{len(snort_rule_list)} snort rules processed.'
        snort_rule_list.clear()
        msg = {'msg': error_msg}
        snort_rule_list.append(msg)

    return snort_rule_list

def get_snort_rule_id(db: Session, value: int) -> SnortRule:
    rules = []
    rule = db.query(SnortRule).get(value)
    rules.append(rule)
    return rules

def get_snort_rule_action(db: Session, value: str) -> list[SnortRule]:
    rules = db.query(SnortRule).filter(SnortRule.action.like(f"%{value}%")).all()
    return rules

def get_snort_rule_protocol(db: Session, value: str) -> list[SnortRule]:
    rules = db.query(SnortRule).filter(SnortRule.protocol.like(f"%{value}%")).all()
    return rules

def get_snort_rule_src_ip(db: Session, value: str) -> list[SnortRule]:
    rules = db.query(SnortRule).filter(SnortRule.src_ip.like(f"%{value}%")).all()
    return rules

def get_snort_rule_src_port(db: Session, value: str) -> list[SnortRule]:
    rules = db.query(SnortRule).filter(SnortRule.src_port.like(f"%{value}%")).all()
    return rules

def get_snort_rule_direction(db: Session, value: str) -> list[SnortRule]:
    rules = db.query(SnortRule).filter(SnortRule.direction.like(f"%{value}%")).all()
    return rules

def get_snort_rule_dst_ip(db: Session, value: str) -> list[SnortRule]:
    rules = db.query(SnortRule).filter(SnortRule.dst_ip.like(f"%{value}%")).all()
    return rules

def get_snort_rule_dst_port(db: Session, value: str) -> list[SnortRule]:
    rules = db.query(SnortRule).filter(SnortRule.dst_port.like(f"%{value}%")).all()
    return rules

def get_snort_rule_date_added(db: Session, value: str) -> list[SnortRule]:
    rules = db.query(SnortRule).filter(SnortRule.date_added.like(f"%{value}%")).all()
    return rules

def get_snort_rule_body_options(db: Session, value: str) -> list[SnortRule]:
    rules = db.query(SnortRule).filter(SnortRule.body_options.like(f"%{value}%")).all()
    return rules

def update_snort_rule(db: Session, id: int, rule_text: str) -> SnortRule:
    db_rule = db.query(SnortRule).get(id)
    parser = SnortParser()
    rule = parser.parse_rules(rule_text)[0]
    db_rule.action = rule.action
    db_rule.src_ip = rule.source_ip
    db_rule.src_port = rule.source_port
    db_rule.direction = rule.direction
    db_rule.dst_ip = rule.dest_ip
    db_rule.dst_port = rule.dest_port
    db_rule.body_options = str(rule.body_options)
    db.commit()
    return db_rule

def delete_snort_rule(db: Session, id: int) -> dict:
    rule = db.query(SnortRule).get(id)
    if rule is None:
        return {"msg": "No rule found with that id."}
    rule_id = rule.id
    db.delete(rule)
    db.commit()
    return {"msg": f"Snort rule with id {rule_id} deleted."}

def get_rule_str(db: Session, id: int) -> str:
    rule = db.query(SnortRule).get(id)
    parser = SnortParser()
    rebuilt_options = json.loads(rule.body_options)

    rebuilt_rule = parser.rebuild_rule(
        action=rule.action,
        protocol=rule.protocol,
        source_ip=rule.src_ip,
        source_port=rule.src_port,
        direction=rule.direction,
        dest_ip=rule.dst_ip,
        dest_port=rule.dst_port,
        body_options=rebuilt_options
    )
    return rebuilt_rule



