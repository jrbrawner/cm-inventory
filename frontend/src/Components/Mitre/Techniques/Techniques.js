import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import MitreDataService from '../../../services/mitre.service';
import Spinner from 'react-bootstrap/Spinner';

export default function App() {

    const [techniques, setTechniques] = React.useState(); 
    const navigate = useNavigate();

    React.useEffect(() => {
        MitreDataService.getTechniques().then( function (response) {
            setTechniques(response.data);
        }).catch(function (error) {
            if (error.response)
                {
                    console.log(error.response);
                }
        })
    }, []);

    function formatTactics(tactics) {
        var tacticString = [];
        tactics.map((tactic) => {
            tacticString.push(<a key={tactic.id} href={`/mitre/tactic/${tactic.id}`}>{tactic.name}</a>);
            tacticString.push(" ")
        })
        return (<>{tacticString}</>);
    }

    if (!techniques) return (
        <Spinner className="mt-5" animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    )

    return (
        
        <Container className="mt-2">
            <h5>MITRE ATT&CK Enterprise Techniques</h5>
            <h6>{techniques.length} Techniques</h6>
            <hr/>
            <Row md={3}>
                {techniques.map((technique) => {
                    return (
                        <Col key={technique.id}>
                            <Card className="mb-2" bg="light">
                                <Card.Header>{technique.id}</Card.Header>
                                <Card.Body>
                                    <Card.Title>{technique.name}</Card.Title>
                                    <Card.Text>
                                    </Card.Text>
                                    <Button variant="primary" onClick={() => navigate(`/mitre/technique/${technique.id}`)}>View</Button>
                                </Card.Body>
                                <Card.Footer className="text-muted">
                                    {formatTactics(technique.tactics)}
                                </Card.Footer>
                            </Card>
                        </Col>
                    )
                })}
            </Row>
        </Container>
        
    )
}