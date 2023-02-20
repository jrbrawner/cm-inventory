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

app = FastAPI(debug=False)

app.include_router(user_router)
app.include_router(mitre_router)
app.include_router(yara_router)
app.include_router(snort_router)
app.include_router(sigma_router)
add_pagination(app)

@app.on_event("startup")
def startup():
    #fix_plyara_imports()
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
        print(f"Startup database seeding time: {et - st}")


def fix_plyara_imports():
    """DO NOT RECOMMEND."""
    try:
        path = '../venv/Lib/site-packages/plyara/core.py'
        core = open(path).read()

        old_import = """
        IMPORT_OPTIONS = {'pe',
                        'elf',
                        'cuckoo',
                        'magic',
                        'hash',
                        'math',
                        'dotnet',
                        'time',
                        'androguard'}"""

        new_import = """
        IMPORT_OPTIONS = {'pe',
                        'elf',
                        'cuckoo',
                        'magic',
                        'hash',
                        'math',
                        'dotnet',
                        'time',
                        'androguard',
                        'macho',
                        'console'}"""

        testing = core.replace(old_import, new_import)
        
        open(path, 'w').write(testing)
    except:
        print('Error fixing plyara imports.')