from sqlalchemy.orm import Session
from src.snort.models import SnortRule
from SRParser import SnortParser

def create_snort_rules(db: Session, rules_text: str) -> list[SnortRule]:
    """Method for parsing and creating snort rules."""
    parser = SnortParser()
    snort_rule_list = []
    rules = parser.parse_rules(rules_text)
    for rule in rules:
        print(rule.body_string)
        db_rule = SnortRule(
            action=rule.action,
            protocol=rule.protocol,
            src_ip=rule.source_ip,
            src_port=rule.source_port,
            direction=rule.direction,
            dst_ip=rule.dest_ip,
            dst_port=rule.dest_port,
            body=rule.body_string,
            body_options=str(rule.body_options)
        )
        db.add(db_rule)
        db.commit()
        snort_rule_list.append(db_rule)

    for i in parser.error_log:
        error_msg = {'msg': i}
        snort_rule_list.append(error_msg)

    return snort_rule_list

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
    db_rule.body = rule.body_string
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



