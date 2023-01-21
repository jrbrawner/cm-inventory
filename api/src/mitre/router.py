from fastapi import APIRouter, HTTPException, Depends
from src.mitre.schemas import (
    TacticBase,
    TechniqueBase,
    SubTechniqueBase,
    TacticTechnique,
    TacticTechniqueExtended,
)
from src.mitre.models import Technique
from src.mitre.constants import MitreLookup
from sqlalchemy.orm import Session
from src.dependencies import get_db
from src.mitre import services
from src.yara.models import YaraRule
from mitreattack.navlayers import Layer, ToSvg, SVGConfig
import json
from src.snort.models import SnortRule
from src.mitre.classes import TechniqueLayerList

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
    response_model=TacticTechniqueExtended,
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


@router.get("/mitre/generate-heatmap", tags=["mitre"])
def generate_heatmap(db: Session = Depends(get_db)):

    yara_rules_to_viz = (
        db.query(YaraRule)
        .filter(YaraRule.techniques != None)
        .filter(YaraRule.subtechniques != None)
        .all()
    )
    snort_rules_to_viz = (
        db.query(SnortRule)
        .filter(SnortRule.techniques != None)
        .filter(YaraRule.subtechniques != None)
        .all()
    )

    rule_list = TechniqueLayerList()

    for rule in yara_rules_to_viz:
        for technique in rule.techniques:
            rule_list.add_technique_yara(technique.id)
        for subtechnique in rule.subtechniques:
            rule_list.add_technique_yara(subtechnique.id)

    for rule in snort_rules_to_viz:
        for technique in rule.techniques:
            rule_list.add_technique_snort(technique.id)
        for subtechnique in rule.subtechniques:
            rule_list.add_technique_snort(subtechnique.id)

    layer = rule_list.generate_mitre_layer(layer_name="my_layer", description="idk")

    with open("src/mitre/layers/test_layer.json", "w", encoding="utf-8") as file:
        json.dump(layer, file, ensure_ascii=False, indent=4)
    file.close()

    return "Layer created with countermeasure data."


@router.get("/mitre/create-layer", tags=["mitre"])
def load_layer_to_svg():

    lay = Layer()
    lay.from_file("src/mitre/layers/test_layer.json")

    # Using taxii server for template
    config = SVGConfig(
        width=12,
        height=12,
        headerHeight=1,
        unit="in",
        showSubtechniques="all",
        font="sans-serif",
        tableBorderColor="#6B7279",
        showHeader=True,
        legendDocked=True,
        legendX=0,
        legendY=0,
        legendWidth=2,
        legendHeight=1,
        showLegend=True,
        showFilters=True,
        showAbout=True,
        showDomain=True,
        border=0.104,
    )

    viz = ToSvg(
        domain="enterprise",
        source="local",
        resource="src/mitre/data/mitre-enterprise-attack.json",
        config=config,
    )

    viz.to_svg(layerInit=lay, filepath="src/mitre/viz/test.svg")
    return "Test SVG created."
