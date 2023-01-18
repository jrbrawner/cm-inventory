from fastapi import APIRouter, HTTPException, Depends
from src.mitre.schemas import (
    TacticBase,
    TechniqueBase,
    SubTechniqueBase,
    TacticTechnique,
)
from src.mitre.models import Technique
from src.mitre.constants import MitreLookup
from sqlalchemy.orm import Session
from src.dependencies import get_db
from src.mitre import services
from src.yara.models import YaraRule
from mitreattack.navlayers import Layer, ToSvg, SVGConfig
import re
import json
from src.yara.schemas import YaraSchema

router = APIRouter()


@router.get("/mitre/tactic/{type}/{term}", response_model=TacticBase, tags=["mitre"])
def get_mitre_tactic(
    type: MitreLookup, term: str, db: Session = Depends(get_db)
) -> TacticBase:
    if type is MitreLookup.ID:
        tactic = services.get_mitre_tactic_id(db, term)
        if tactic is None:
            raise HTTPException(404, "No tactic found with that id.")
        return tactic
    if type is MitreLookup.Name:
        tactic = services.get_mitre_tactic_name(db, term)
        if tactic is None:
            raise HTTPException(404, "No tactic found with that name.")
        return tactic


@router.get(
    "/mitre/tactic/{type}/{term}/techniques",
    response_model=TacticTechnique,
    tags=["mitre"],
)
def get_mitre_tactic_techniques(
    type: MitreLookup, term: str, db: Session = Depends(get_db)
) -> TacticTechnique:
    if type is MitreLookup.ID:
        tactic = services.get_mitre_tactic_id(db, term)
        if tactic is None:
            raise HTTPException(404, "No tactic found with that id.")
        return tactic
    if type is MitreLookup.Name:
        tactic = services.get_mitre_tactic_name(db, term)
        if tactic is None:
            raise HTTPException(404, "No tactic found with that name.")
        return tactic
    
@router.get("/mitre/generate-heatmap", tags=['mitre'])
def generate_heatmap(db: Session = Depends(get_db)):

    rules_to_viz = db.query(YaraRule).filter(YaraRule.techniques.isnot(None)).all()
    pattern = "[T][0-9][0-9][0-9][0-9]"
    techniques_list = []
    technique_list = []

    for i in rules_to_viz:
        model = YaraSchema.from_orm(i)
        techniques = [x for x in model.techniques]
        for i in techniques:
            techniques_list.append(i)

    for i in technique_list:
        techniques_list.append({
                "techniqueID": i,
                "score": 1,
                "metadata": [
                    {
                        "name": "Coverage",
                        "value": "Yara"
                    }
                ]
            })

        layer = {
        "name": "test example",
        "versions": {
            "layer": "4.3",
            "navigator": "4.3"
        },
        "sorting": 3, # descending order of score
        "description": "An example layer where all techniques have a randomized score",
        "domain": "enterprise-attack",
        "techniques": techniques_list,
        }
    
        with open('test_layer.json', "w", encoding="utf-8") as file:
            json.dump(layer, file, ensure_ascii=False, indent=4)
        file.close()

    return 'Layer created with Yara rules data.'

def load_layer_to_svg():

    lay = Layer()
    lay.from_file(path + "/test_layer.json")
    # Using taxii server for template

    config = SVGConfig(width=12, height=12, headerHeight=1, unit="in",\
        showSubtechniques="all", font="sans-serif", tableBorderColor="#6B7279",\
        showHeader=True, legendDocked=True, legendX=0, legendY=0, legendWidth=2,\
        legendHeight=1, showLegend=True, showFilters=True,
        showAbout=True, showDomain=True, border=0.104)

    viz = ToSvg(domain='enterprise', source="local",\
         resource=path+"/mitre-enterprise-attack.json", config=config)
    
    
    viz.to_svg(layerInit=lay, filepath="test.svg")
    print('Test SVG created.')