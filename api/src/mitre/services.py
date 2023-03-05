from sqlalchemy.orm import Session
from src.mitre.models import Tactic, Technique, Subtechnique
from src.yara.models import YaraRule
from src.snort.models import SnortRule
from src.sigma.models import SigmaRule
from fastapi_pagination import paginate, Page

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

def get_mitre_tactic_yara(db: Session, id: str) -> Page[YaraRule]:
    """Return all yara rules associated with a mitre tactic."""
    return paginate(db.query(Tactic).get(id).yara_rules)

def get_mitre_tactic_snort(db: Session, id: str) -> Page[SnortRule]:
    """Return all Snort rules associated with a mitre tactic."""
    return paginate(db.query(Tactic).get(id).snort_rules)

def get_mitre_tactic_sigma(db: Session, id: str) -> Page[SigmaRule]:
    """Return all Sigma rules associated with a mitre tactic."""
    return paginate(db.query(Tactic).get(id).sigma_rules)

def get_mitre_technique_yara(db: Session, id: str) -> Page[YaraRule]:
    """Return all yara rules associated with a mitre technique."""
    return paginate(db.query(Technique).get(id).yara_rules)

def get_mitre_technique_snort(db: Session, id: str) -> Page[SnortRule]:
    """Return all snort rules associated with a mitre technique."""
    return paginate(db.query(Technique).get(id).snort_rules)

def get_mitre_technique_sigma(db: Session, id: str) -> Page[SigmaRule]:
    """Return all sigma rules associated with a mitre technique."""
    return paginate(db.query(Technique).get(id).sigma_rules)

def get_mitre_subtechnique_yara(db: Session, id: str) -> Page[YaraRule]:
    """Return all yara rules associated with a mitre subtechnique."""
    return paginate(db.query(Subtechnique).get(id).yara_rules)

def get_mitre_subtechnique_snort(db: Session, id: str) -> Page[SnortRule]:
    """Return all snort rules associated with a mitre subtechnique."""
    return paginate(db.query(Subtechnique).get(id).snort_rules)

def get_mitre_subtechnique_sigma(db: Session, id: str) -> Page[SigmaRule]:
    """Return all sigma rules associated with a mitre subtechnique."""
    return paginate(db.query(Subtechnique).get(id).sigma_rules)