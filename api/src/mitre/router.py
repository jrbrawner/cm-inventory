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
from collections import Counter

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

    yara_rules_to_viz = db.query(YaraRule).filter(YaraRule.techniques != None).all()
    yara_techniques_list = []
    yara_technique_list = []
    yara_technique_set = set()
    
    for rule in yara_rules_to_viz:
        for technique in rule.techniques:
            yara_technique_list.append(technique.id)
    
    for technique in yara_technique_list:
        occ = Counter(yara_technique_list)
        technique_count = {technique: occ[technique]}
        yara_technique_set.add(tuple(technique_count.items()))

    
    for i in yara_technique_set:
        technique = dict(i)
        print(technique)
        yara_techniques_list.append({
                "techniqueID": str(*technique),
                "score": technique.pop(*technique),
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
            "layer": "4.4",
            "navigator": "4.8.0"
        },
        "sorting": 3, # descending order of score
        "description": "testing generation of heatmaps based on countermeasure coverage",
        "domain": "enterprise-attack",
        "techniques": yara_techniques_list,
        }
    
        with open('src/mitre/layers/test_layer.json', "w", encoding="utf-8") as file:
            json.dump(layer, file, ensure_ascii=False, indent=4)
        file.close()
        
    return 'Layer created with Yara rules data.'

@router.get("/mitre/create-layer", tags=['mitre'])
def load_layer_to_svg():

    lay = Layer()
    lay.from_file("src/mitre/layers/test_layer.json")

    # Using taxii server for template
    config = SVGConfig(width=12, height=12, headerHeight=1, unit="in",\
        showSubtechniques="all", font="sans-serif", tableBorderColor="#6B7279",\
        showHeader=True, legendDocked=True, legendX=0, legendY=0, legendWidth=2,\
        legendHeight=1, showLegend=True, showFilters=True,
        showAbout=True, showDomain=True, border=0.104)

    viz = ToSvg(domain='enterprise', source="local",\
         resource="src/mitre/data/mitre-enterprise-attack.json", config=config)
    
    viz.to_svg(layerInit=lay, filepath="src/mitre/viz/test.svg")
    return 'Test SVG created.'