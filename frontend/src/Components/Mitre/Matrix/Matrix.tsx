import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import MitreDataService from '../../../services/mitre.service';
import Spinner from 'react-bootstrap/Spinner';

interface ITactic {
    id: string
    name: string
    description: string
    reference: string
}

interface ITechnique {
    id : string
    name : string
    description : string
    tactics : Array<ITactic>
}

export default function App() {

    const navigate = useNavigate();
    const [techniques, setTechniques] = React.useState<{[key: string]: ITechnique}>({});
    const [tactics, setTactics] = React.useState<{[key: string]: ITactic}>({});

    const [tacticsOrdered, setTacticsOrdered] = React.useState<any>();
    const [credentialAccessTechniques, setCredentialAccessTechniques] = React.useState<Array<ITechnique>>([]);
    const [executionTechniques, SetExecutionTechniques] = React.useState<Array<ITechnique>>([]);
    const [impactTechniques, setImpactTechniques] = React.useState<Array<ITechnique>>([]);
    const [persistenceTechniques, setPersistenceTechniques] = React.useState<Array<ITechnique>>([]);
    const [privEscTechniques, setPrivEscTechniques] = React.useState<Array<ITechnique>>([]); 
    const [lateralMovementTechniques, setLateralMovementTechniques] = React.useState<Array<ITechnique>>([]);
    const [defenseEvasionTechniques, setDefenseEvasionTechniques] = React.useState<Array<ITechnique>>([]);
    const [exfiltrationTechniques, setExfiltrationTechniques] = React.useState<Array<ITechnique>>([]);
    const [discoveryTechniques, setDiscoveryTechniques] = React.useState<Array<ITechnique>>([]);
    const [collectionTechniques, setCollectionTechniques] = React.useState<Array<ITechnique>>([]);
    const [resourceDevTechniques, setResourceDevelopmentTechniques] = React.useState<Array<ITechnique>>([]);
    const [reconTechniques, setReconTechniques] = React.useState<Array<ITechnique>>([]);
    const [c2Techniques, setC2Techniques] = React.useState<Array<ITechnique>>([]);
    const [initialAccessTechniques, setInitialAccessTechniques] = React.useState<Array<ITechnique>>([]);

    React.useEffect(() => {
        MitreDataService.getTechniqueTactics().then((response => {
            setTechniques(response.data);
            fillMitreData(response.data);
        }))
    }, [])
    
    React.useEffect(() => {
        MitreDataService.getTactics().then((response => {
            
            Object.entries(response.data).map(([key, value]) => {
                //convert to dict, tactic name as key
            })
            
            setTactics(response.data);


        }))
    }, [])

    if (!techniques) return (
        <Spinner className="mt-5" animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    )
    
    if (!tactics) return (
        <Spinner className="mt-5" animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    )

    const fillMitreData = (techniqueData: {[key: string]: ITechnique}) => {
        var credentialTechniques: Array<ITechnique> = [];
        var executionTechniques: Array<ITechnique> = [];
        var impactTechniques: Array<ITechnique> = [];
        var persistenceTechniques: Array<ITechnique> = [];
        var privEscTechniques: Array<ITechnique> = [];
        var lateralMovementTechniques: Array<ITechnique> = [];
        var defenseEvasionTechniques: Array<ITechnique> = [];
        var exfiltrationTechniques: Array<ITechnique> = [];
        var discoveryTechniques: Array<ITechnique> = [];
        var collectionTechniques: Array<ITechnique> = [];
        var resourceDevTechniques: Array<ITechnique> = [];
        var reconTechniques: Array<ITechnique> = [];
        var c2Techniques: Array<ITechnique> = [];
        var initialAccessTechniques: Array<ITechnique> = [];
        
        
        Object.entries(techniqueData).map(([key, value]) => {
            value.tactics.map(tactic => {
                if (tactic.name === "Credential Access"){
                    credentialTechniques.push(value);
                }
                if (tactic.name === "Execution"){
                    executionTechniques.push(value);
                }
                if (tactic.name === "Impact"){
                    impactTechniques.push(value);
                }
                if (tactic.name === "Persistence"){
                    persistenceTechniques.push(value);
                }
                if (tactic.name === "Privilege Escalation"){
                    privEscTechniques.push(value);
                }
                if (tactic.name === "Lateral Movement"){
                    lateralMovementTechniques.push(value);
                }
                if (tactic.name === "Defense Evasion"){
                    defenseEvasionTechniques.push(value);
                }
                if (tactic.name === "Exfiltration"){
                    exfiltrationTechniques.push(value);
                }
                if (tactic.name === "Discovery"){
                    discoveryTechniques.push(value);
                }
                if (tactic.name === "Collection"){
                    collectionTechniques.push(value);
                }
                if (tactic.name === "Resource Development"){
                    resourceDevTechniques.push(value);
                }
                if (tactic.name === "Reconnaissance"){
                    reconTechniques.push(value);
                }
                if (tactic.name === "Command and Control"){
                    c2Techniques.push(value);
                }
                if (tactic.name === "Initial Access"){
                    initialAccessTechniques.push(value);
                }


            })
        })
        setCredentialAccessTechniques(credentialTechniques);
        SetExecutionTechniques(executionTechniques);
        setImpactTechniques(impactTechniques);
        setPersistenceTechniques(persistenceTechniques);
        setPrivEscTechniques(privEscTechniques);
        setLateralMovementTechniques(lateralMovementTechniques);
        setDefenseEvasionTechniques(defenseEvasionTechniques);
        setExfiltrationTechniques(exfiltrationTechniques);
        setDiscoveryTechniques(discoveryTechniques);
        setCollectionTechniques(collectionTechniques);
        setResourceDevelopmentTechniques(resourceDevTechniques);
        setReconTechniques(reconTechniques);
        setC2Techniques(c2Techniques);
        setInitialAccessTechniques(initialAccessTechniques);
    }
    {/*Object.entries(tactics).map(([key, value]) => (
               <th key={value.id}>{value.name}</th>
    ))*/}
    const tacticsRow = () => {
        return (
            Object.entries(tactics).map(([key, value]) => (
                <th key={value.id}>{value.name}</th>
            ))

        )
    }

    const credentialColumn = () => {
        return (
            credentialAccessTechniques.map((technique) => {
                return (
                    <tr key={technique.id}>{technique.name}</tr>
                    )
            })
        )   
    }

    const executionColumn = () => {
        return (
            executionTechniques.map((technique) => {
                return (
                    <tr key={technique.id}>{technique.name}</tr>
                    )
            })
        )
    }

    const impactColumn = () => {
        return (
            impactTechniques.map((technique) => {
                return (
                    <tr key={technique.id}>{technique.name}</tr>
                    )
            })
        )
    }

    const persistenceColumn = () => {
        return (
            persistenceTechniques.map((technique) => {
                return (
                    <tr key={technique.id}>{technique.name}</tr>
                    )
            })
        )
    }

    const privEscColumn = () => {
        return (
            privEscTechniques.map((technique) => {
                return (
                    <tr key={technique.id}>{technique.name}</tr>
                    )
            })
        )
    }
    
    const lateralMovementColumn = () => {
        return (
            lateralMovementTechniques.map((technique) => {
                return (
                    <tr key={technique.id}>{technique.name}</tr>
                    )
            })
        )
    }

    const defenseEvasionColumn = () => {
        return (
            defenseEvasionTechniques.map((technique) => {
                return (
                    <tr key={technique.id}>{technique.name}</tr>
                    )
            })
        )
    }

    const exfiltrationColumn = () => {
        return (
            exfiltrationTechniques.map((technique) => {
                return (
                    <tr key={technique.id}>{technique.name}</tr>
                    )
            })
        )
    }   

    const discoveryColumn = () => {
        return (
            discoveryTechniques.map((technique) => {
                return (
                    <tr key={technique.id}>{technique.name}</tr>
                    )
            })
        )
    }

    const collectionColumn = () => {
        return (
            collectionTechniques.map((technique) => {
                return (
                    <tr key={technique.id}>{technique.name}</tr>
                    )
            })
        )
    }

    const resourceDevColumn = () => {
        return (
            resourceDevTechniques.map((technique) => {
                return (
                    <tr key={technique.id}>{technique.name}</tr>
                    )
            })
        )
    }

    const reconColumn = () => {
        return (
            reconTechniques.map((technique) => {
                return (
                    <tr key={technique.id}>{technique.name}</tr>
                    )
            })
        )
    }

    const c2Column = () => {
        return (
            c2Techniques.map((technique) => {
                return (
                    <tr key={technique.id}>{technique.name}</tr>
                    )
            })
        )
    }

    const initialAccessColumn= () => {
        return (
            initialAccessTechniques.map((technique) => {
                return (
                    <tr key={technique.id}>{technique.name}</tr>
                    )
            })
        )
    }


    return (
        
        <Container className="mt-2">
            <Table>
                <thead>
                    <tr>
                        {tacticsRow()}
                    </tr>
                </thead>
                <tbody>
                    <td>{credentialColumn()}</td>
                    
                </tbody>
            </Table>
        </Container>
    
    )
}