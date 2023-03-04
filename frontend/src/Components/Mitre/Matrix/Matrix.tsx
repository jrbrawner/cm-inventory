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
    const [credentialAccessTechniques, setCredentialAccessTechniques] = React.useState<Array<ITechnique>>([]);
    const [executionTechniques, SetExecutionTechniques] = React.useState<Array<ITechnique>>([]);

    
    React.useEffect(() => {
        MitreDataService.getTechniqueTactics().then((response => {
            setTechniques(response.data);
            var credentialAccessTechniques: Array<ITechnique> = [];
            var executionTechniques: Array<ITechnique> = [];
            var tempTechniques = techniques;
            Object.entries(tempTechniques).map(([key, value]) => {
                value.tactics.map(tactic => {
                    if (tactic.name === "Credential Access"){
                        credentialAccessTechniques.push(value);
                    }
                    if (tactic.name === "Execution"){
                        executionTechniques.push(value);
                    }
                })
            })
            setCredentialAccessTechniques(credentialAccessTechniques);
            SetExecutionTechniques(executionTechniques);
        }))
    }, [])
    

    React.useEffect(() => {
        MitreDataService.getTactics().then((response => {
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

    const tacticsRow = () => {
       return (
           Object.entries(tactics).map(([key, value]) => (
               <th key={value.id}>{value.name}</th>
           ))
       )
    }

    const credentialColumn = () => {
        var credentialTechniques = credentialAccessTechniques;
        return (
            <Table>
                {credentialTechniques.map((technique) => {
                    return (
                        <tr key={technique.id}>{technique.name}</tr>
                        )
                    })}
            </Table> 
        )     
    }

    const executionColumn = () => {
        var execution = executionTechniques;
        return (
            <Table>
                {execution.map((technique) => {
                    return (
                        <tr key={technique.id}>{technique.name}</tr>
                        )
                })}
            </Table>
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
                    <tr>
                        <td>{credentialColumn()}</td>
                        <td>{executionColumn()}</td>
                    </tr>
                </tbody>
            </Table>
        </Container>
    
    )
}