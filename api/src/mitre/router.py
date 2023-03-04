from fastapi import APIRouter, HTTPException, Depends, UploadFile, Form
from src.mitre.schemas import (
    TacticBase,
    TechniqueBase,
    SubTechniqueBase,
    TacticTechnique,
    TacticTechnique,
    TechniqueTactics,
    TechniqueExtended,
    SubTechniqueExtended,
    LayerRequest
)
from src.mitre.models import Technique
from src.mitre.constants import MitreLookup
from sqlalchemy.orm import Session
from src.dependencies import get_db
from src.mitre import services
from src.yara.models import YaraRule
from mitreattack.navlayers import Layer, ToSvg, SVGConfig, ToExcel
import json
from src.yara.schemas import YaraSchema
from src.snort.models import SnortRule
from src.sigma.models import SigmaRule
from src.mitre.classes import LayerGenerator
from src.sigma.schemas import SigmaSchema
from src.snort.schemas import SnortSchema
from fastapi_pagination import Page
from typing import Optional
import tempfile

router = APIRouter()


@router.get("/api/mitre/tactics", response_model=list[TacticBase], tags=["mitre"])
def get_mitre_tactics(db: Session = Depends(get_db)):
    """Get all mitre tactics."""
    mitre_tactics = services.get_mitre_tactics(db)
    if mitre_tactics is None:
        raise HTTPException(400, 'Error in retrieving tactics.')
    return mitre_tactics


@router.get("/api/mitre/tactics/{id}", response_model=TacticBase, tags=['mitre'])
def get_mitre_tactic_id(id: str, db: Session = Depends(get_db)):
    """Get a specific mitre tactic."""
    tactic = services.get_mitre_tactic_id(db, id)
    if tactic is None:
        raise HTTPException(400, 'Error in retrieving tactic.')
    return tactic

@router.get("/api/mitre/tactic/{id}/techniques", response_model=TacticTechnique, tags=['mitre'])
def get_mitre_tactic_techniques(id: str, db: Session = Depends(get_db)):
    """Get a specific mitre tactic and all associated techniques."""
    techniques = services.get_mitre_tactic_techniques(db, id)
    if techniques is None:
        raise HTTPException(400, 'Error in retrieving techniques associated with that tactic.')
    return techniques

@router.get("/api/mitre/tactic/{id}/yara", response_model=Page[YaraSchema], tags=['mitre'])
def get_tactic_yara_rules(id: str, db: Session = Depends(get_db)):
    """Get all Yara rules associated with a mitre tactic ID."""
    yara_rules = services.get_mitre_tactic_yara(db, id)
    if yara_rules is None:
        raise HTTPException(400, 'Error in retrieving yara rules.')
    return yara_rules

@router.get("/api/mitre/tactic/{id}/snort", response_model=Page[SnortSchema], tags=['mitre'])
def get_tactic_snort_rules(id: str, db: Session = Depends(get_db)):
    """Get all Snort rules associated with a mitre tactic ID."""
    snort_rules = services.get_mitre_tactic_snort(db, id)
    if snort_rules is None:
        raise HTTPException(400, 'Error in retrieving snort rules.')
    return snort_rules

@router.get("/api/mitre/tactic/{id}/sigma", response_model=Page[SigmaSchema], tags=['mitre'])
def get_tactic_sigma_rules(id: str, db: Session = Depends(get_db)):
    """Get all Sigma rules associated with a mitre tactic ID."""
    sigma_rules = services.get_mitre_tactic_sigma(db, id)
    if sigma_rules is None:
        raise HTTPException(400, 'Error in retrieving sigma rules.')
    return sigma_rules

@router.get("/api/mitre/technique/{id}/yara", response_model=Page[YaraSchema], tags=['mitre'])
def get_technique_yara_rules(id: str, db: Session = Depends(get_db)):
    """Get all Yara rules associated with a mitre technique ID."""
    yara_rules = services.get_mitre_technique_yara(db, id)
    if yara_rules is None:
        raise HTTPException(400, 'Error in retrieving yara rules.')
    return yara_rules

@router.get("/api/mitre/technique/{id}/snort", response_model=Page[SnortSchema], tags=['mitre'])
def get_technique_snort_rules(id: str, db: Session = Depends(get_db)):
    """Get all Snort rules associated with a mitre technique ID."""
    snort_rules = services.get_mitre_technique_snort(db, id)
    if snort_rules is None:
        raise HTTPException(400, 'Error in retrieving snort rules.')
    return snort_rules

@router.get("/api/mitre/technique/{id}/sigma", response_model=Page[SigmaSchema], tags=['mitre'])
def get_technique_sigma_rules(id: str, db: Session = Depends(get_db)):
    """Get all Sigma rules associated with a mitre technique ID."""
    sigma_rules = services.get_mitre_technique_sigma(db, id)
    if sigma_rules is None:
        raise HTTPException(400, 'Error in retrieving sigma rules.')
    return sigma_rules

@router.get("/api/mitre/subtechnique/{id}/yara", response_model=Page[YaraSchema], tags=['mitre'])
def get_subtechnique_yara_rules(id: str, db: Session = Depends(get_db)):
    """Get all Yara rules associated with a mitre technique ID."""
    yara_rules = services.get_mitre_subtechnique_yara(db, id)
    if yara_rules is None:
        raise HTTPException(400, 'Error in retrieving yara rules.')
    return yara_rules

@router.get("/api/mitre/subtechnique/{id}/snort", response_model=Page[SnortSchema], tags=['mitre'])
def get_subtechnique_snort_rules(id: str, db: Session = Depends(get_db)):
    """Get all Snort rules associated with a mitre technique ID."""
    snort_rules = services.get_mitre_subtechnique_snort(db, id)
    if snort_rules is None:
        raise HTTPException(400, 'Error in retrieving snort rules.')
    return snort_rules

@router.get("/api/mitre/subtechnique/{id}/sigma", response_model=Page[SigmaSchema], tags=['mitre'])
def get_subtechnique_sigma_rules(id: str, db: Session = Depends(get_db)):
    """Get all Sigma rules associated with a mitre technique ID."""
    sigma_rules = services.get_mitre_subtechnique_sigma(db, id)
    if sigma_rules is None:
        raise HTTPException(400, 'Error in retrieving sigma rules.')
    return sigma_rules

@router.get("/api/mitre/tactic/{type}/{term}", response_model=TacticBase, tags=["mitre"])
def get_mitre_tactic(
    type: MitreLookup, term: str, db: Session = Depends(get_db)
) -> TacticBase:
    """Get mitre tactic based on search type and term."""
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

@router.get("/api/mitre/techniques", response_model=list[TechniqueTactics], tags=['mitre'])
def get_mitre_techniques(db: Session = Depends(get_db)):
    """Get all mitre techniques."""
    techniques = services.get_mitre_techniques(db)
    if techniques is None:
        raise HTTPException(400, 'Error in retrieving techniques.')
    return techniques

@router.get("/api/mitre/techniques-tactics", response_model=list[TechniqueTactics], tags=['mitre'])
def get_mitre_techniques_tactics(db: Session = Depends(get_db)):
    """Get all mitre techniques."""
    techniques = services.get_mitre_techniques(db)
    if techniques is None:
        raise HTTPException(400, 'Error in retrieving techniques.')
    return techniques

@router.get("/api/mitre/technique/{id}", response_model=TechniqueExtended, tags=['mitre'])
def get_mitre_technique(id: str, db: Session = Depends(get_db)):
    """Get a specific mitre technique and all associated objects."""
    technique = services.get_mitre_technique(db, id)
    if technique is None:
        raise HTTPException(400, 'Error in retrieving technique.')
    return technique

@router.get("/api/mitre/subtechniques", response_model=list[SubTechniqueBase], tags=['mitre'])
def get_mitre_subtechniques(db: Session = Depends(get_db)):
    """Get all mitre subtechniques."""
    subtechniques = services.get_mitre_subtechniques(db)
    if subtechniques is None:
        raise HTTPException(400, 'Error in retrieving subtechniques.')
    return subtechniques

@router.get("/api/mitre/subtechnique/{id}", response_model=SubTechniqueExtended, tags=['mitre'])
def get_mitre_subtechnique(id: str, db: Session = Depends(get_db)):
    """Get a specific mitre subtechnique and all associated objects."""
    subtechnique = services.get_mitre_subtechnique(db, id)
    if subtechnique is None:
        raise HTTPException(400, 'Error in retrieving subtechnique.')
    return subtechnique



@router.post("/api/mitre/layer", tags=['mitre'])
def create_mitre_layer(form_data : LayerRequest = Depends(LayerRequest.as_form), db: Session = Depends(get_db)):

    yara_rules = None
    snort_rules = None
    sigma_rules = None
    
    if form_data.yara_check == "on":
        yara_rules = (
            db.query(YaraRule)
            .filter(YaraRule.techniques != None)
            .filter(YaraRule.subtechniques != None)
            .all()
        )
    if form_data.snort_check == "on":
        snort_rules = (
            db.query(SnortRule)
            .filter(SnortRule.techniques != None)
            .filter(SnortRule.subtechniques != None)
            .all()
        )
    if form_data.sigma_check == "on":
        sigma_rules = (
            db.query(SigmaRule)
            .filter(SigmaRule.techniques != None)
            .filter(SigmaRule.subtechniques != None)
            .all()
        )
    
    layer_generator = LayerGenerator()
    layer = layer_generator.generate_mitre_layer(layer_name=form_data.layer_name, description=form_data.layer_description,
                                                 yara_rules=yara_rules, snort_rules=snort_rules, sigma_rules=sigma_rules)
    
    
    return json.dumps(layer)

@router.post("/api/mitre/heatmap", tags=["mitre"])
def generate_heatmap(file: UploadFile | None = None, layer_text: str = Form(None), db: Session = Depends(get_db)):
    """Generate a layer based on countermeasure mitre coverage."""

    if file is not None:
        layer_text = file.file.read().decode()

    layer = Layer()
    layer.from_dict(json.loads(layer_text))
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

    #local path = 'src/mitre/data/mitre-enterprise-attack.json'
    path = 'api/src/mitre/data/mitre-enterprise-attack.json' #docker path
    viz = ToSvg(
        domain="enterprise",
        source="local",
        resource=path,
        config=config,
    )
    file_text = ""
    with tempfile.TemporaryDirectory() as tmp_dir:
        file_name = tmp_dir + '/test.svg'
        viz.to_svg(layerInit=layer, filepath=file_name)
        file_text = open(file_name).read()
    

    return {"results": "Layer created with countermeasure data.", "visualization": file_text}

@router.post("/api/mitre/layer/convert_xlsx", tags=['mitre'])
def layer_to_xlsx(file: UploadFile | None = None, layer_text: str = Form(None)):

    if file is not None:
        layer_text = file.file.read().decode()

    layer = Layer()
    layer.from_dict(json.loads(layer_text))

    x = ToExcel(domain="enterprise",
        source="local",
        resource="src/mitre/data/mitre-enterprise-attack.json")
    
    x.to_xlsx(layerInit=layer, filepath="src/mitre/viz/testing.xlsx")

    return "Excel sheet created."