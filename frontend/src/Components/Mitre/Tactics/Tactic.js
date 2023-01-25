import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import MitreDataService from '../../../services/mitre.service';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export default function App() {
    const [tactic, setTactic] = React.useState();

    const params = useParams();
    const navigate = useNavigate();

    React.useEffect(() => {
        MitreDataService.getTacticTechniques(params.id).then( function (response) {
            setTactic(response.data);
        }).catch(function (error) {
            if (error.response)
                {
                    console.log(error.response);
                }
        })
    }, []);

    if (!tactic) return <p>Loading...</p>
    
    return (
        <Container>
            <Card className="text-center mt-3">
                <Card.Header>
                    Tactic Name
                    <h5>{tactic.name}</h5>
                </Card.Header>
                <Card.Body>
                    <div className="input-group text-start">
                        <p>{tactic.description}</p>
                    </div>
                    <hr/>
                    <h5>Associated Countermeasures</h5>
                        <Row md={3}>     
                        <Col>
                        <Card className="mb-2" bg="light">
                            <Card.Body>
                                <Card.Title>Yara</Card.Title>
                                <Card.Text>
                                    View {tactic.name} associated Yara rules.
                                </Card.Text>
                                <Button variant="outline-primary" onClick={() => navigate(`/yara/home`)}>View</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col sm>
                        <Card className="mb-2" bg="light">
                            <Card.Body>
                                <Card.Title>Snort</Card.Title>
                                <Card.Text>
                                    View {tactic.name} associated Snort rules.
                                </Card.Text>
                                <Button variant="outline-primary">View</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col sm>
                        <Card className="mb-2" bg="light">
                            <Card.Body>
                                <Card.Title>Sigma</Card.Title>
                                <Card.Text>
                                    View {tactic.name} associated Sigma rules.
                                </Card.Text>
                                <Button variant="outline-primary">View</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                        </Row>
                    <hr/>
                    <h5>{tactic.techniques.length} Associated Techniques</h5>
                    <Container className="mt-2">
                        <Row md={3}>
                            {tactic.techniques.map((technique) => {
                                return (
                                    <Col key={technique.id}>
                                        <Card className="mb-2" bg="light">
                                            <Card.Header>{technique.id}</Card.Header>
                                            <Card.Body>
                                                <Card.Title>{technique.name}</Card.Title>
                                                <Card.Text>
                                                </Card.Text>
                                                <Button variant="outline-primary" onClick={() => navigate(`/mitre/technique/${technique.id}`)}>View</Button>
                                            </Card.Body>
                                    </Card>
                                    </Col>
                                )
                            })}
                        </Row>
                    </Container>

                </Card.Body>
                <Card.Footer className="text-muted"><a href={tactic.reference}>{tactic.reference}</a></Card.Footer>
            </Card>
        </Container>
    )

}