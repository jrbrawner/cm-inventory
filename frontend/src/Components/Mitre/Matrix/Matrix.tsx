import React from 'react';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
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

export default function App() {

    const navigate = useNavigate();
    const [techniques, setTechniques] = React.useState();
    const [tactics, setTactics] = React.useState<{[key: number]: ITactic}>({});

    {/*}
    React.useEffect(() => {
        MitreDataService.getTechniques().then((response => {
            setTechniques(response.data);
        }))
    }, [])
    {*/}

    React.useEffect(() => {
        MitreDataService.getTactics().then((response => {
            setTactics(response.data);
        }))
    }, [])


    {/*}
    if (!techniques) return (
        <Spinner className="mt-5" animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    )
    {*/}

    if (!tactics) return (
        <Spinner className="mt-5" animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    )

    const createTactics = () => {
       
        for (let [key, value] of Object.entries<ITactic>(tactics)){
            

            
        }
    }
    
    return (
        
        <Container className="mt-2">
            <Table>
                
            <thead>
                <tr>
                    {createTactics()}
                </tr>
            </thead>
            </Table>
        </Container>
    
    )
}