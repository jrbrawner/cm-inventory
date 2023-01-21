from sqlalchemy.orm import Session
from src.yara.models import YaraRule
from src.mitre.models import Tactic, Technique, Subtechnique
from YaraParser import MultiParser, SingleParser


def create_yara_rules(db: Session, rules_text: str) -> list[YaraRule]:
    """Method for parsing and creating yara rules."""
    parser = MultiParser(rules_text, strip_whitespace=True)
    rules = parser.get_rules_dict()
    yara_rule_list = []
    # keyword_list = ['tactic', 'technique', 'subtechnique']
    for name, rule in rules.items():

        if (
            db.query(YaraRule).filter(YaraRule.name == rule["rule_name"]).scalar()
            is None
        ):

            yara_rule = YaraRule(
                name=rule["rule_name"],
                meta=rule["rule_meta"],
                strings=rule["rule_strings"],
                conditions=rule["rule_conditions"],
                raw_text=rule["raw_text"],
                logic_hash=rule["rule_logic_hash"],
                compiles=rule["compiles"],
            )

            if rule["rule_meta_kvp"] is None:
                tactic = None
                technique = None
                subtechnique = None
                author = None
                description = None
            else:
                tactic = parser.get_meta_fields(
                    rule_meta_kvp=rule["rule_meta_kvp"], meta_keyword="tactic"
                )
                technique = parser.get_meta_fields(
                    rule_meta_kvp=rule["rule_meta_kvp"], meta_keyword="technique"
                )
                subtechnique = parser.get_meta_fields(
                    rule_meta_kvp=rule["rule_meta_kvp"], meta_keyword="subtechnique"
                )
                author = parser.get_meta_fields(
                    rule_meta_kvp=rule["rule_meta_kvp"], meta_keyword="author"
                )
                description = parser.get_meta_fields(
                    rule_meta_kvp=rule["rule_meta_kvp"], meta_keyword="description"
                )

            if tactic is not None:
                tactics = tactic.split(",")
                tactics = [x.strip() for x in tactics]
                tactic_db_list = [
                    db.query(Tactic).filter(Tactic.id == x).first() for x in tactics
                ]
                [yara_rule.tactics.append(x) for x in tactic_db_list]

            if technique is not None:
                techniques = technique.split(",")
                techniques = [x.strip() for x in techniques]
                technique_db_list = [
                    db.query(Technique).filter(Technique.id == x).first()
                    for x in techniques
                ]
                [yara_rule.techniques.append(x) for x in technique_db_list]

            if subtechnique is not None:
                subtechniques = subtechnique.split(",")
                subtechniques = [x.strip() for x in subtechniques]
                subtechnique_db_list = [
                    db.query(Subtechnique).filter(Subtechnique.id == x).first()
                    for x in subtechniques
                ]
                [yara_rule.subtechniques.append(x) for x in subtechnique_db_list]

            if author is not None:
                yara_rule.author = author

            if description is not None:
                yara_rule.description = description

            db.add(yara_rule)
            yara_rule_list.append(yara_rule)
        else:
            yara_rule_list.append(
                {
                    "msg": "Yara rule already exists with {} name.".format(
                        rule["rule_name"]
                    )
                }
            )
    db.commit()
    return yara_rule_list


def get_yara_rules_name(db: Session, value: str) -> list[YaraRule]:
    """Search for yara rules using the name field."""
    rules = db.query(YaraRule).filter(YaraRule.name.like(f"%{value}%")).all()
    return rules


def get_yara_rules_meta(db: Session, value: str) -> list[YaraRule]:
    """Search for yara rules using the meta field."""
    rules = db.query(YaraRule).filter(YaraRule.meta.like(f"%{value}%")).all()
    return rules


def get_yara_rules_strings(db: Session, value: str) -> list[YaraRule]:
    """Search for yara rules using the strings field."""
    rules = db.query(YaraRule).filter(YaraRule.strings.like(f"%{value}%")).all()
    return rules


def get_yara_rules_conditions(db: Session, value: str) -> list[YaraRule]:
    """Search for yara rules using the conditions field."""
    rules = db.query(YaraRule).filter(YaraRule.conditions.like(f"%{value}%")).all()
    return rules


def get_yara_rules_logic_hash(db: Session, value: str) -> list[YaraRule]:
    """Search for yara rules using the logic_hash field."""
    rules = db.query(YaraRule).filter(YaraRule.logic_hash.like(f"%{value}%")).all()
    return rules


def get_yara_rules_author(db: Session, value: str) -> list[YaraRule]:
    """Search for yara rules using the date added field."""
    rules = db.query(YaraRule).filter(YaraRule.date_added.like(f"%{value}%")).all()
    return rules


def get_yara_rules_compiles(db: Session, value: str) -> list[YaraRule]:
    """Search for yara rules using the compiles field."""
    rules = db.query(YaraRule).filter(YaraRule.compiles.like(f"%{value}%")).all()
    return rules


def get_yara_rules_tactics(db: Session, value: str) -> list[YaraRule]:
    """Search for yara rules using the tactics ID field."""
    rules = db.query(YaraRule).filter(YaraRule.tactics.any(id=value)).all()
    return rules


def get_yara_rules_techniques(db: Session, value: str) -> list[YaraRule]:
    """Search for yara rules using the tactics ID field."""
    rules = db.query(YaraRule).filter(YaraRule.techniques.any(id=value)).all()
    return rules


def get_yara_rules_subtechniques(db: Session, value: str) -> list[YaraRule]:
    """Search for yara rules using the tactics ID field."""
    rules = db.query(YaraRule).filter(YaraRule.subtechniques.any(id=value)).all()
    return rules


def update_yara_rule(db: Session, id: int, rule_text: str) -> YaraRule:
    """Update yara rule."""
    db_rule: YaraRule
    db_rule = db.query(YaraRule).get(id)
    if db_rule is None:
        return None
    parser = SingleParser(rule_text, strip_whitespace=True)
    rule = parser.get_rule_dict()
    db_rule.name = rule["rule_name"]
    db_rule.meta = rule["rule_meta"]
    db_rule.strings = rule["rule_strings"]
    db_rule.conditions = rule["rule_conditions"]
    db_rule.raw_text = rule["raw_text"]
    db_rule.logic_hash = rule["rule_logic_hash"]
    db_rule.author = parser.get_meta_field("author")
    db_rule.description = parser.get_meta_field("description")
    db_rule.compiles = rule["compiles"]
    db.commit()
    return db_rule


def delete_yara_rule(db: Session, id: int) -> dict:
    rule = db.query(YaraRule).filter(YaraRule.id == id).first()
    if rule is None:
        return {"msg": "No rule found with that id."}
    rule_name = rule.name
    db.delete(rule)
    db.commit()
    return {"msg": f"Yara rule with name {rule_name} deleted."}
