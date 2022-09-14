from api.dependencies import get_db
from fastapi import Depends
from sqlalchemy.orm import Session


def test_db(db: Session = Depends(get_db)):
    assert db is not None
