import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import MitreDataService from '../../../services/mitre.service';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import '../../../Custom/mitreMatrix.module.css';

interface ITactic {
    id: string
    name: string
}

interface ISubtechnique {
    id: string
    name: string
}

interface ITechnique {
    id : string
    name : string
    tactics : Array<ITactic>
    subtechniques : Array<ISubtechnique>
}

export default function App() {

    const navigate = useNavigate();
    const [techniques, setTechniques] = React.useState<{[key: string]: ITechnique}>({});
    const [tactics, setTactics] = React.useState<{[key: string]: ITactic}>({});
    const [tacticsRow, setTacticsRow] = React.useState<any>();

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
        MitreDataService.getTacticsBasic().then((response => {
            let tempTactics : {[key: string]: ITactic} = response.data;
            let tacticsDict : {[key: string]: ITactic} = {}

            Object.entries(tempTactics).map(([key, value]) => {
                tacticsDict[value.name] = value;
            })
            tacticsDisplay(tacticsDict);
            setTactics(tacticsDict);


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

    
    const tacticsDisplay = (data: any) => {

        var tempTactics = data;
        setTacticsRow(
            <>
                <a href={`/mitre/tactic/${tempTactics["Reconnaissance"].id}`}>{tempTactics["Reconnaissance"].name}</a>
                <th>{tempTactics["Resource Development"].name}</th>
                <th>{tempTactics["Initial Access"].name}</th>
                <th>{tempTactics["Execution"].name}</th>
                <th>{tempTactics["Persistence"].name}</th>
                <th>{tempTactics["Privilege Escalation"].name}</th>
                <th>{tempTactics["Defense Evasion"].name}</th>
                <th>{tempTactics["Credential Access"].name}</th>
                <th>{tempTactics["Discovery"].name}</th>
                <th>{tempTactics["Lateral Movement"].name}</th>
                <th>{tempTactics["Collection"].name}</th>
                <th>{tempTactics["Command and Control"].name}</th>
                <th>{tempTactics["Exfiltration"].name}</th>
                <th>{tempTactics["Impact"].name}</th>
            </>
        )
    }

    const credentialColumn = () => {
        return (
            <table>
                <tbody>
                {credentialAccessTechniques.map((technique) => {
                    return (
                        <tr key={technique.id}><a href={`/mitre/technique/${technique.id}`}>{technique.name}</a></tr>
                        )
                    })}
                </tbody>
            </table>
        )   
    }

    const executionColumn = () => {
        return (
            <table>
            <tbody>
            {executionTechniques.map((technique) => {
                return (
                    <tr key={technique.id}><a href={`/mitre/technique/${technique.id}`}>{technique.name}</a></tr>
                    )
                })}
            </tbody>
        </table>
        )
    }

    const impactColumn = () => {
        return (
            <table>
                <tbody>
            {impactTechniques.map((technique) => {
                return (
                    <tr key={technique.id}><a href={`/mitre/technique/${technique.id}`}>{technique.name}</a></tr>
                    )
                })}
                </tbody>
            </table>
        )
    }

    const persistenceColumn = () => {
        return (
            <table>
                <tbody>
            {persistenceTechniques.map((technique) => {
                return (
                    <tr key={technique.id}><a href={`/mitre/technique/${technique.id}`}>{technique.name}</a></tr>
                    )
                })}
                </tbody>
            </table>
        )
    }

    const privEscColumn = () => {
        return (
            <table>
                <tbody>
            {privEscTechniques.map((technique) => {
                return (
                    <tr key={technique.id}><a href={`/mitre/technique/${technique.id}`}>{technique.name}</a></tr>
                    )
                })}
                </tbody>
            </table>
        )
    }
    
    const lateralMovementColumn = () => {
        return (
            <table>
                <tbody>
            {lateralMovementTechniques.map((technique) => {
                return (
                    <tr key={technique.id}><a href={`/mitre/technique/${technique.id}`}>{technique.name}</a></tr>
                    )
                })}
                </tbody>
            </table>
        )
    }

    const defenseEvasionColumn = () => {
        return (
            <table>
                <tbody>
            {defenseEvasionTechniques.map((technique) => {
                return (
                    <tr key={technique.id}><a href={`/mitre/technique/${technique.id}`}>{technique.name}</a></tr>
                    )
                })}
                </tbody>
            </table>
        )
    }

    const exfiltrationColumn = () => {
        return (
            <table>
                <tbody>
            {exfiltrationTechniques.map((technique) => {
                return (
                    <tr key={technique.id}><a href={`/mitre/technique/${technique.id}`}>{technique.name}</a></tr>
                    )
                })}
                </tbody>
            </table>
        )
    }   

    const discoveryColumn = () => {
        return (
            <table>
                <tbody>
            {discoveryTechniques.map((technique) => {
                return (
                    <tr key={technique.id}><a href={`/mitre/technique/${technique.id}`}>{technique.name}</a></tr>
                    )
                })}
                </tbody>
            </table>
        )
    }

    const collectionColumn = () => {
        return (
            <table>
                <tbody>
            {collectionTechniques.map((technique) => {
                return (
                    <tr key={technique.id}><a href={`/mitre/technique/${technique.id}`}>{technique.name}</a></tr>
                    )
                })}
                </tbody>
            </table>
        )
    }

    const resourceDevColumn = () => {
        return (
            <table>
                <tbody>
            {resourceDevTechniques.map((technique) => {
                return (
                    <>
                        <tr>
                            <td key={technique.id}>
                                <div>
                                    
                                    <a href={`/mitre/technique/${technique.id}`}>{technique.name}</a>
                                </div>
                            </td>
                        </tr>
                    </>
                    
                    )
                })}
                </tbody>
            </table>
        )
    }

    const reconColumn = () => {
        return (
            <table>
                <tbody>
            {reconTechniques.map((technique) => {
                return (
                    <tr key={technique.id}><a href={`/mitre/technique/${technique.id}`}>{technique.name}</a></tr>
                    )
                })}
                </tbody>
            </table>
        )
    }

    const c2Column = () => {
        return (
            <table>
                <tbody>
            {c2Techniques.map((technique) => {
                return (
                    <tr key={technique.id}><a href={`/mitre/technique/${technique.id}`}>{technique.name}</a></tr>
                    )
                })}
                </tbody>
            </table>
        )
    }

    const initialAccessColumn= () => {
        return (
            <table>
                <tbody>
            {initialAccessTechniques.map((technique) => {
                return (
                    <tr key={technique.id}><a href={`/mitre/technique/${technique.id}`}>{technique.name}</a></tr>
                    )
                })}
                </tbody>
            </table>
        )
    }


    return (
        
        <Container className="mt-2 table-responsive">
            <div>

                <table className="table table-bordered">
                    <thead>
                        <tr>
                            {tacticsRow}
                        </tr>
                    </thead>
                    
                        <td>{reconColumn()}</td>
                        <td>{resourceDevColumn()}</td>
                        <td>{initialAccessColumn()}</td>
                        <td>{executionColumn()}</td>
                        <td>{persistenceColumn()}</td>
                        <td>{privEscColumn()}</td>
                        <td>{defenseEvasionColumn()}</td>
                        <td>{credentialColumn()}</td>
                        <td>{discoveryColumn()}</td>
                        <td>{lateralMovementColumn()}</td>
                        <td>{collectionColumn()}</td>
                        <td>{c2Column()}</td>
                        <td>{exfiltrationColumn()}</td>
                        <td>{impactColumn()}</td>
                    
                </table>
            </div>
        </Container>
    
    )
}