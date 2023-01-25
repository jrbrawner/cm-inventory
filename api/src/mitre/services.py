from sqlalchemy.orm import Session
from src.mitre.models import Tactic, Technique, Subtechnique
from src.yara.models import YaraRule

def get_mitre_tactic_id(db: Session, tactic_id: str) -> Tactic:
    return db.query(Tactic).filter(Tactic.id.like(tactic_id)).first()

def get_mitre_tactic_name(db: Session, tactic_name: str) -> Tactic:
    return db.query(Tactic).filter(Tactic.name.like(tactic_name)).first()

def get_mitre_tactics(db: Session) -> list[Tactic]:
    return db.query(Tactic).all()

def get_mitre_tactic_techniques(db: Session, id: str) -> list[Technique]:
    return db.query(Tactic).get(id)
    
def get_mitre_techniques(db: Session) -> list[Technique]:
    return db.query(Technique).all()

def get_mitre_technique(db: Session, id: str) -> Technique:
    return db.query(Technique).get(id)

def get_mitre_subtechniques(db: Session) -> list[Subtechnique]:
    return db.query(Subtechnique).all()

def get_mitre_subtechnique(db: Session, id: str) -> Subtechnique:
    return db.query(Subtechnique).get(id)

def get_mitre_tactic_yara(db: Session, id: str) -> list[YaraRule]:
    """Return all yara rules associated with a mitre tactic."""
    tactic = db.query(Tactic).get(id)
    rules = tactic.yara_rules
    return rules