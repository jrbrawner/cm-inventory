import os
from os import path
import requests
import json
from stix2 import MemoryStore, Filter
from src.mitre.schemas import (
    TechniqueBase,
    SubTechniqueBase,
    TacticBase,
    TechniquePlatformBase,
)
from src.mitre.models import (
    Tactic,
    Technique,
    TechniquePlatform,
    TechniqueReference,
    TechniqueDataSource,
    TechniqueDefenseBypassed,
    Subtechnique,
    SubtechniquePlatform,
    SubtechniqueReference,
    SubtechniqueDataSource,
    SubtechniqueDefenseBypassed,
)
from sqlalchemy.orm import Session

basedir = path.abspath(path.dirname(__file__))
path = basedir

#download_path = 'src/mitre/data/mitre-enterprise-attack.json' # local
download_path = '/code/api/src/mitre/data/mitre-enterprise-attack.json' # docker

def convert_tactic(v) -> str | None:
    tactics = {
        "reconnaissance": "Reconnaissance",
        "resource-development": "Resource Development",
        "initial-access": "Initial Access",
        "execution": "Execution",
        "persistence": "Persistence",
        "privilege-escalation": "Privilege Escalation",
        "defense-evasion": "Defense Evasion",
        "credential-access": "Credential Access",
        "discovery": "Discovery",
        "lateral-movement": "Lateral Movement",
        "collection": "Collection",
        "command-and-control": "Command and Control",
        "exfiltration": "Exfiltration",
        "impact": "Impact",
        "initial_access": "Initial Access"
    }

    return tactics.get(v)


def get_mitre_data():

    if os.path.exists(download_path) is False:
        stix = requests.get(
            "https://raw.githubusercontent.com/mitre \
        /cti/master/enterprise-attack/enterprise-attack.json"
        ).json()

        with open(
            download_path, "w", encoding="utf-8"
        ) as file:
            json.dump(stix, file, ensure_ascii=False, indent=4)
        print("Enterprise attack data downloaded.")
    else:
        print("Enterprise attack data already downloaded.")


def get_mitre_tactics(db: Session):
    """Get MITRE Enterprise Attack Tactics and populate database."""

    # check to see if mitre data has been downloaded
    if os.path.exists(download_path):
        with open(
            download_path, "r", encoding="utf-8"
        ) as file:
            stix = json.load(file)
        file.close()
    # if mitre data not downloaded, download it
    else:
        get_mitre_data()
        with open(
            download_path, "r", encoding="utf-8"
        ) as file:
            stix = json.load(file)
        file.close()

    # check to make sure tactics havent already been populated
    if db.query(Tactic).first() is None:

        # initiate memory store
        ms = MemoryStore(stix_data=stix["objects"])
        # query for tactics
        tactics = ms.query([Filter("type", "=", "x-mitre-tactic")])

        # list to hold tactic ORM objects as we populate them
        tactic_list = []

        for i in tactics:

            # get tactics data
            references = []
            tacticName = i["name"]
            tacticDescription = i["description"]
            tacticID = i["external_references"][0]["external_id"]
            reference = i["external_references"][0]["url"]

            # for reference in i["external_references"]:
            #    references.append(reference.get('url'))

            # create tactic ORM objects
            tactic = Tactic(
                id=tacticID,
                name=tacticName,
                description=tacticDescription,
                reference=reference,
            )

            # create pydantic schema from ORM object, validates ORM object
            tactic_model = TacticBase.from_orm(tactic)

            # add tactic ORM object to database
            db.add(tactic)

        # all tactics have been created
        db.commit()

        print("Tactics data populated.")
    else:
        print("Tactics data already populated.")


def get_mitre_techniques(db: Session):

    if os.path.exists(download_path):
        with open(
            download_path, "r", encoding="utf-8"
        ) as file:
            stix = json.load(file)
        file.close()
    else:
        get_mitre_data()
        with open(
            download_path, "r", encoding="utf-8"
        ) as file:
            stix = json.load(file)
        file.close()

    if db.query(Technique).first() is None:

        ms = MemoryStore(stix_data=stix["objects"])

        techniques = ms.query([Filter("type", "=", "attack-pattern")])
        techniques_list = []
        subtechnique_list = []

        for technique in techniques:

            # skip deprecated and revoked
            if (
                "x_mitre_deprecated" in technique and technique["x_mitre_deprecated"]
            ) or ("revoked" in technique and technique["revoked"]):
                continue

            if technique["x_mitre_is_subtechnique"] == False:
                techniqueID = technique["external_references"][0][
                    "external_id"
                ]  # get attckID
                techniqueName = technique["name"]
                techniqueDescription = technique["description"]
                detection = technique.get("x_mitre_detection")
                techniqueReferences = []
                techniqueTactics = []
                technique_data_sources = technique.get("x_mitre_data_sources")
                techniqueDataSources = []
                technique_defenses_bypassed = technique.get("x_mitre_defense_bypassed")
                techniqueDefensesBypassed = []
                techniquePlatforms = []

                technique_orm = Technique(
                    id=techniqueID,
                    name=techniqueName,
                    description=techniqueDescription,
                    detection=detection
                    # no subtechniques yet
                )
                db.add(technique_orm)
                # db.commit()

                for i in technique["external_references"]:
                    ref = i.get("url")
                    if ref is not None:
                        technique_ref = TechniqueReference(
                            technique_id=techniqueID, url=ref
                        )
                        db.add(technique_ref)
                        # db.commit()
                        techniqueReferences.append(technique_ref)

                technique_orm.references = techniqueReferences
                # db.commit()

                for i in technique["kill_chain_phases"]:
                    tacticName = i.get("phase_name")
                    if tacticName is not None:
                        tactic_name = convert_tactic(tacticName)
                        tactic = db.query(Tactic).filter_by(name=tactic_name).first()
                        techniqueTactics.append(tactic)

                technique_orm.tactics = techniqueTactics
                # db.commit()

                for i in technique["x_mitre_platforms"]:

                    platform = TechniquePlatform(technique_id=techniqueID, platform=i)
                    db.add(platform)
                    # db.commit()

                    techniquePlatforms.append(platform)

                technique_orm.platforms = techniquePlatforms
                # db.commit()

                if technique_data_sources is not None:
                    for i in technique_data_sources:
                        technique_data_source = TechniqueDataSource(
                            technique_id=techniqueID, data_source=i
                        )
                        db.add(technique_data_source)
                        # db.commit()
                        techniqueDataSources.append(technique_data_source)

                    technique_orm.data_sources = techniqueDataSources
                    # db.commit()

                if technique_defenses_bypassed is not None:
                    for i in technique_defenses_bypassed:
                        technique_defense_bypassed = TechniqueDefenseBypassed(
                            technique_id=techniqueID, defense_bypassed=i
                        )
                        db.add(technique_defense_bypassed)
                        # db.commit()
                        techniqueDefensesBypassed.append(technique_defense_bypassed)

                    technique_orm.defenses_bypassed = techniqueDefensesBypassed
                    # db.commit()

                # techniques_list.append(technique)
                techniqueReferences.clear()
                techniqueTactics.clear()
                techniqueDataSources.clear()
                techniqueDefensesBypassed.clear()
                techniquePlatforms.clear()

        db.commit()
        print("Techniques populated.")
    else:
        print("Techniques already populated.")


def get_mitre_subtechniques(db: Session):

    if os.path.exists(download_path):
        with open(
            download_path, "r", encoding="utf-8"
        ) as file:
            stix = json.load(file)
        file.close()
    else:
        get_mitre_data()
        with open(
            download_path, "r", encoding="utf-8"
        ) as file:
            stix = json.load(file)
        file.close()

    if db.query(Subtechnique).first() is None:

        ms = MemoryStore(stix_data=stix["objects"])

        techniques = ms.query([Filter("type", "=", "attack-pattern")])

        for technique in techniques:

            # skip deprecated and revoked
            if (
                "x_mitre_deprecated" in technique and technique["x_mitre_deprecated"]
            ) or ("revoked" in technique and technique["revoked"]):
                continue

            if technique["x_mitre_is_subtechnique"] == True:
                techniqueID = technique["external_references"][0][
                    "external_id"
                ]  # get attckID
                techniqueName = technique["name"]
                techniqueDescription = technique["description"]
                detection = technique.get("x_mitre_detection")
                techniqueReferences = []
                techniqueTactics = []
                technique_data_sources = technique.get("x_mitre_data_sources")
                techniqueDataSources = []
                technique_defenses_bypassed = technique.get("x_mitre_defense_bypassed")
                techniqueDefensesBypassed = []
                techniquePlatforms = []

                technique_orm = Subtechnique(
                    id=techniqueID,
                    name=techniqueName,
                    description=techniqueDescription,
                    detection=detection,
                )
                db.add(technique_orm)
                # db.commit()

                for i in technique["external_references"]:
                    ref = i.get("url")
                    if ref is not None:
                        technique_ref = SubtechniqueReference(
                            technique_id=techniqueID, url=ref
                        )
                        db.add(technique_ref)
                        # db.commit()
                        techniqueReferences.append(technique_ref)

                technique_orm.references = techniqueReferences
                # db.commit()

                for i in technique["x_mitre_platforms"]:

                    platform = SubtechniquePlatform(
                        technique_id=techniqueID, platform=i
                    )
                    db.add(platform)
                    # db.commit()

                    techniquePlatforms.append(platform)

                technique_orm.platforms = techniquePlatforms
                # db.commit()

                if technique_data_sources is not None:
                    for i in technique_data_sources:
                        technique_data_source = SubtechniqueDataSource(
                            technique_id=techniqueID, data_source=i
                        )
                        db.add(technique_data_source)
                        # db.commit()
                        techniqueDataSources.append(technique_data_source)

                    technique_orm.data_sources = techniqueDataSources
                    # db.commit()

                if technique_defenses_bypassed is not None:
                    for i in technique_defenses_bypassed:
                        technique_defense_bypassed = SubtechniqueDefenseBypassed(
                            technique_id=techniqueID, defense_bypassed=i
                        )
                        db.add(technique_defense_bypassed)
                        # db.commit()
                        techniqueDefensesBypassed.append(technique_defense_bypassed)

                    technique_orm.defenses_bypassed = techniqueDefensesBypassed
                # db.commit()

                technique_id = techniqueID.split(".")[0]

                technique = db.query(Technique).get(technique_id)

                technique.subtechniques.append(technique_orm)
                # db.commit()

                # techniques_list.append(technique)
                techniqueReferences.clear()
                techniqueTactics.clear()
                techniqueDataSources.clear()
                techniqueDefensesBypassed.clear()
                techniquePlatforms.clear()

            db.commit()
        print("Subtechniques populated.")
    else:
        print("Subtechniques already populated.")
