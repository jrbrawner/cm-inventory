from fastapi import FastAPI
from src.mitre.models import Tactic
from src.db import Base, engine, SessionLocal
from src.auth.router import router as user_router
from src.mitre.router import router as mitre_router
from src.yara.router import router as yara_router
from src.snort.router import router as snort_router
from src.sigma.router import router as sigma_router
import time
from fastapi_pagination import add_pagination

tags_metadata = [
    {
        "name": "auth",
        "description": "Operations with users. The **login** logic is also here.",
    },
    {
        "name": "mitre",
        "description": "Create and manage mitre data.",
    },
    {
        "name": "yara",
        "description": "Create and manage yara rules.",
    },
    {
        "name": "snort",
        "description": "Create and manage snort rules.",
    },
    {
        "name": "sigma",
        "description": "Create and manage sigma rules.",
    },
]

app = FastAPI(debug=True)

app.include_router(user_router)
app.include_router(mitre_router)
app.include_router(yara_router)
app.include_router(snort_router)
app.include_router(sigma_router)
add_pagination(app)

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    if SessionLocal().query(Tactic).first() is None:
        from src.mitre.utils import (
            get_mitre_data,
            get_mitre_tactics,
            get_mitre_techniques,
            get_mitre_subtechniques,
        )

        st = time.time()
        get_mitre_data()
        get_mitre_tactics(SessionLocal())
        get_mitre_techniques(SessionLocal())
        get_mitre_subtechniques(SessionLocal())
        et = time.time()
        print(f"Execution time:{et - st}")
