from sqlalchemy.orm import Session
from src.mitre.models import Tactic


def get_mitre_tactic_id(db: Session, tactic_id: str) -> Tactic:
    return db.query(Tactic).filter(Tactic.id.like(tactic_id)).first()


def get_mitre_tactic_name(db: Session, tactic_name: str) -> Tactic:
    return db.query(Tactic).filter(Tactic.name.like(tactic_name)).first()
