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

    const [subtechniques, setSubtechniques] = React.useState(); 
    const navigate = useNavigate();

    React.useEffect(() => {
        MitreDataService.getSubtechniques().then( function (response) {
            setSubtechniques(response.data);
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
            tacticString.push(<a href={`/mitre/tactic/${tactic.id}`}>{tactic.name}</a>);
            tacticString.push(" ")
        })
        return (<>{tacticString}</>);
    }

    if (!subtechniques) return (
        <Spinner className="mt-5" animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    )

    return (
        <>
            <Container className="mt-2">
                <h5>MITRE ATT&CK Enterprise Subtechniques</h5>
                <h6>{subtechniques.length} Subtechniques</h6>
                <hr/>
                <Row md={3}>
                    {subtechniques.map((subtechnique) => {
                        return (
                            <Col key={subtechnique.id}>
                                <Card className="mb-2" bg="light">
                                    <Card.Header>{subtechnique.id}</Card.Header>
                                    <Card.Body>
                                        <Card.Title>{subtechnique.name}</Card.Title>
                                        <Card.Text>
                                        </Card.Text>
                                        <Button variant="primary" onClick={() => navigate(`/mitre/subtechnique/${subtechnique.id}`)}>View</Button>
                                    </Card.Body>
                                    <Card.Footer className="text-muted">
                                        
                                    </Card.Footer>
                                </Card>
                            </Col>
                        )
                    })}
                </Row>
            </Container>
        </>
    )
}