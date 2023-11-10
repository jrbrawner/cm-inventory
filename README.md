## Overview

Countermeasure Inventory is a project designed to store various countermeasures (Yara, Snort, Sigma rules) and provide tooling for working with them. Listed below are some of the high level features.

## Mitre
- Search Mitre ATTACK Tactics, techniques, sub-techniques
- View associated countermeasures
- Generate heatmaps based on countermeasure coverage of tactics, techniques, sub-techniques
- Mitre Matrix

## Yara
- CRUD
- Search by field
- Mapping to Mitre ATTACK
- Detecting IOC's (Run database Yara rules over indicators)

## Snort
- CRUD
- Search by field
- Rule builder and deconstructor
- Virtualized Snort appliance through Docker
    - Read PCAP files
    - Analyze PCAP files for detections using database rules

## Sigma
- CRUD
- Search by field

## Building Countermeasure Inventory

Countermeasure Inventory primarily uses FastAPI, React, and Docker. 

The easiest way to build the project is through docker, by running <code>docker compose up</code> in the docker folder.

You can also build just the backend by going to the api folder and running:

<code>python -m venv venv</code>

Windows: <code>./venv/Scripts/Activate</code>

Linux: <code>. venv/bin/activate </code>

<code>pip install -r requirements.txt</code>

<code>uvicorn src.main:app</code>

The frontend uses Yarn for package management.

<code>yarn install</code>

<code>yarn start</code>

The project supports using a local database (SQLite) or remote database (Postgres).

If you are using the Postgres database, the "ENVIRONMENT" variable in the .env file in the api folder should be changed to "docker".

Additionally, the database credentials should be changed accordingly.

## TODO
I took a long hiatus from working on this project and have just started again recently. Some of the things I plan on working on in the near-future:

- Documentation
- Tests

<hr/>

Thanks for checking it out! Feel free to open any issues if you have suggestions.







