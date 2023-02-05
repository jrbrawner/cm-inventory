import React from 'react';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

export default function App() {

    const navigate = useNavigate();
    
    return (
        
        <Container className="mt-2">
            <Row md={3}>
                <Col>
                    <Card className="mb-2" bg="light">
                        <Card.Body>
                            <Card.Title>Tactics</Card.Title>
                            <Card.Text>
                                Explore data and countermeasures associated with MITRE tactics.
                            </Card.Text>
                            <Button variant="primary" onClick={() => navigate(`/mitre/tactics`)}>View</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card className="mb-2" bg="light">
                        <Card.Body>
                            <Card.Title>Techniques</Card.Title>
                            <Card.Text>
                                Explore data and countermeasures associated with MITRE techniques.
                            </Card.Text>
                            <Button variant="primary" onClick={() => navigate(`/mitre/techniques`)}>View</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card className="mb-2" bg="light">
                        <Card.Body>
                            <Card.Title>Subtechniques</Card.Title>
                            <Card.Text>
                                Explore data and countermeasures associated with MITRE subtechniques.
                            </Card.Text>
                            <Button variant="primary" onClick={() => navigate(`/mitre/subtechniques `)}>View</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card className="mb-2" bg="light">
                        <Card.Body>
                            <Card.Title>MITRE Visualizations</Card.Title>
                            <Card.Text>
                                Generate heatmaps based on countermeasure coverage.
                            </Card.Text>
                            <Button variant="primary" onClick={() => navigate(`/mitre/visualizations/home `)}>View</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    
    )
}