from sqlalchemy.orm import Session
from src.snort.models import SnortRule
from SRParser import SnortParser
from src.mitre.models import Tactic, Technique, Subtechnique
import json
from fastapi_pagination.ext.sqlalchemy import paginate

import re

def create_snort_rules(db: Session, rules_text: str = None, file_text: str = None) -> list[SnortRule]:
    """Method for parsing and creating snort rules."""
    parser = SnortParser()
    snort_rule_list = []

    if file_text is not None:
        rules_text = ""
        for file in file_text:
            rules_text += file
    
    rules = parser.parse_rules(rules_text)
    for error in parser.error_log:
        snort_rule_list.append({"msg": error , "variant": "danger"})
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
            body_options=rule_options,
        )
        
        # checking for mitre att&ck designations in rem option
        # checking for name in msg
        # put these in a class at some point?
        if "rem" or "msg" in str(rule.body_options):
            for option in rule.body_options:
                for key, value in option.items():
                    if key == "msg":
                        db_rule.msg = value
                    if key == "rem":
                        value = value.replace('"', "")
                        mitre = value.split(",")
                        for i in mitre:
                            opts = i.split(":")
                            if opts[0].strip() == "tactic":
                                tactic_db = db.query(Tactic).get(opts[1])
                                if tactic_db is not None:
                                    db_rule.tactics.append(tactic_db)
                            if opts[0].strip() == "technique":
                                technique_db = db.query(Technique).get(opts[1])
                                if technique_db is not None:
                                    db_rule.techniques.append(technique_db)
                            if opts[0].strip() == "subtechnique":
                                subtechnique_db = db.query(Subtechnique).get(opts[1])
                                if subtechnique_db is not None:
                                    db_rule.subtechniques.append(subtechnique_db)

        db.add(db_rule)
        if db_rule.msg is None:
            snort_rule_list.append({"msg": f"Rule with no name added to database." , "variant": "success"})
        else:
            snort_rule_list.append({"msg": f"{db_rule.msg}" , "variant": "success"})
    
    db.commit()

    return snort_rule_list


def get_snort_rule_id(db: Session, id: int) -> SnortRule:
    return db.query(SnortRule).get(id)

def get_snort_rule_action(db: Session, value: str) -> list[SnortRule]:
    return paginate(db.query(SnortRule).filter(SnortRule.action.like(f"%{value}%")))
    
def get_snort_rule_protocol(db: Session, value: str) -> list[SnortRule]:
    return paginate(db.query(SnortRule).filter(SnortRule.protocol.like(f"%{value}%")))
    
def get_snort_rule_src_ip(db: Session, value: str) -> list[SnortRule]:
    return paginate(db.query(SnortRule).filter(SnortRule.src_ip.like(f"%{value}%")))

def get_snort_rule_src_port(db: Session, value: str) -> list[SnortRule]:
    return paginate(db.query(SnortRule).filter(SnortRule.src_port.like(f"%{value}%")))
    
def get_snort_rule_direction(db: Session, value: str) -> list[SnortRule]:
    return paginate(db.query(SnortRule).filter(SnortRule.direction.like(f"%{value}%")))
    
def get_snort_rule_dst_ip(db: Session, value: str) -> list[SnortRule]:
    return paginate(db.query(SnortRule).filter(SnortRule.dst_ip.like(f"%{value}%")))
    
def get_snort_rule_dst_port(db: Session, value: str) -> list[SnortRule]:
    return paginate(db.query(SnortRule).filter(SnortRule.dst_port.like(f"%{value}%")))
    
def get_snort_rule_date_added(db: Session, value: str) -> list[SnortRule]:
    return paginate(db.query(SnortRule).filter(SnortRule.date_added.like(f"%{value}%")))
    
def get_snort_rule_body_options(db: Session, value: str) -> list[SnortRule]:
    return paginate(db.query(SnortRule).filter(SnortRule.body_options.like(f"%{value}%")))

def get_snort_rules_tactics(db: Session, value: str) -> list[SnortRule]:
    """Search for yara rules using tactics information."""
    pattern_tactic = "[T][A][0-9][0-9][0-9][0-9]"
    if re.match(pattern_tactic, value.upper()):
        return paginate(db.query(SnortRule).filter(SnortRule.tactics.any(id=value.upper())))
        
    tactic_id = db.query(Tactic).filter(Tactic.name.like(f"%{value}%")).first().id
    if tactic_id is not None:
        return paginate(db.query(SnortRule).filter(SnortRule.tactics.any(id=tactic_id)))
    
def get_snort_rules_techniques(db: Session, value: str) -> list[SnortRule]:
    """Search for yara rules using the techniques ID field."""
    pattern_technique = "[T][0-9][0-9][0-9][0-9]"
    if re.match(pattern_technique, value.upper()):
        return paginate(db.query(SnortRule).filter(SnortRule.techniques.any(id=value.upper())))
        
    technique_id = db.query(Technique).filter(Technique.name.like(f"%{value}%")).first().id
    if technique_id is not None:
        return paginate(db.query(SnortRule).filter(SnortRule.techniques.any(id=technique_id)))
    
def get_snort_rules_subtechniques(db: Session, value: str) -> list[SnortRule]:
    """Search for yara rules using the subtechniques ID field."""
    pattern_subtechnique = "[T][0-9][0-9][0-9][0-9][.][0-9][0-9][0-9]"
    if re.match(pattern_subtechnique, value.upper()):
        return paginate(db.query(SnortRule).filter(SnortRule.subtechniques.any(id=value.upper())))
        
    subtechnique_id = db.query(Subtechnique).filter(Subtechnique.name.like(f"%{value}%")).first().id
    if subtechnique_id is not None:
        return paginate(db.query(SnortRule).filter(SnortRule.subtechniques.any(id=subtechnique_id)))

def update_snort_rule(db: Session, id: int, rule_text: str) -> SnortRule:
    db_rule = db.query(SnortRule).get(id)
    parser = SnortParser()
    rule = parser.parse_rules(rule_text)[0]
    rule_options = json.dumps(rule.body_options)
    db_rule.action = rule.action
    db_rule.src_ip = rule.source_ip
    db_rule.src_port = rule.source_port
    db_rule.direction = rule.direction
    db_rule.dst_ip = rule.dest_ip
    db_rule.dst_port = rule.dest_port
    db_rule.body_options = rule_options

    # checking for mitre att&ck designations in rem option
    # need to put these in a class at some point?
    if "rem" in str(rule.body_options):
        for option in rule.body_options:
            for key, value in option.items():
                if key == "rem":
                    value = value.replace('"', "")
                    mitre = value.split(",")
                    for i in mitre:
                        opts = i.split(":")
                        if opts[0].strip() == "tactic":
                            tactic_db = db.query(Tactic).get(opts[1])
                            db_rule.tactics.append(tactic_db)
                        if opts[0].strip() == "technique":
                            technique_db = db.query(Technique).get(opts[1])
                            db_rule.techniques.append(technique_db)
                        if opts[0].strip() == "subtechnique":
                            subtechnique_db = db.query(Subtechnique).get(opts[1])
                            db_rule.subtechniques.append(subtechnique_db)

    db.commit()
    return db_rule

def delete_snort_rule(db: Session, id: int) -> dict:
    """Delete a single snort rule."""
    rule = db.query(SnortRule).get(id)
    if rule is None:
        return {"msg": "No rule found with that id."}
    rule_id = rule.id
    db.delete(rule)
    db.commit()
    return {"msg": f"Snort rule with id {rule_id} deleted."}

def get_rule_str(db: Session, id: int) -> str:
    """Rebuild a snort rules raw text form."""
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
        body_options=rebuilt_options,
    )
    return rebuilt_rule

def test_snort_rule(rule_string: str) -> str:
    """Attempt to parse a rule string to see if it passes."""
    print(rule_string)
    parser = SnortParser()
    parser.parse_rules(rule_string)
    if len(parser.error_log) != 0:
        return {"msg": parser.error_log[0], "variant": "danger"}
    else:
        return {"msg": "Rule compiled successfully.", "variant": "success"}

def deconstruct_snort_rule(rule_string: str) -> str:
    """Attempt to parse a rule string to see if it passes."""
    parser = SnortParser()
    rule = parser.parse_rules(rule_string.strip())[0]
    
    if len(parser.error_log) != 0:
        return {"msg": parser.error_log[0], "variant": "danger"}
    else:
        return {"rule": rule.__dict__, "variant": "success"}