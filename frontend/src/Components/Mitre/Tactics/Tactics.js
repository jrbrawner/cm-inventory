import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import MitreDataService from '../../../services/mitre.service';

export default function App() {

    const [tactics, setTactics] = React.useState(); 
    const navigate = useNavigate();

    React.useEffect(() => {
        MitreDataService.getTactics().then((response) => {
            setTactics(response.data);
        }).catch(function (error) {
            if (error.response)
                {
                    console.log(error.response);
                }
        })
    }, []);

    if (!tactics) return <p>Loading...</p>

    return (
        <>
            <Container className="mt-2">
                <h5>MITRE ATT&CK Enterprise Tactics</h5>
                <h6>{tactics.length} Tactics</h6>
                <hr/>
                <Row md={3}>
                    {tactics.map((tactic) => {
                        return (
                            <Col key={tactic.id}>
                                <Card className="mb-2" bg="light">
                                    <Card.Header>{tactic.id}</Card.Header>
                                    <Card.Body>
                                        <Card.Title>{tactic.name}</Card.Title>
                                        <Card.Text>
                                        </Card.Text>
                                        <Button variant="primary" onClick={() => navigate(`/mitre/tactic/${tactic.id}`)}>View</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                    })}
                </Row>
            </Container>
        </>
    )
}