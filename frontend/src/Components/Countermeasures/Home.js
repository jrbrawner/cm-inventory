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
        <>
            <Container className="mt-2">
                <Row md={3}>
                    <Col>
                        <Card className="mb-2" bg="light">
                            <Card.Body>
                                <Card.Title>Yara</Card.Title>
                                <Card.Text>
                                    Create and manage Yara rules.
                                </Card.Text>
                                <Button variant="primary" onClick={() => navigate(`/yara/home`)}>View</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col sm>
                        <Card className="mb-2" bg="light">
                            <Card.Body>
                                <Card.Title>Snort</Card.Title>
                                <Card.Text>
                                    Create and manage Snort rules.
                                </Card.Text>
                                <Button variant="primary" onClick={() => navigate(`/snort/home`)}>View</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col sm>
                        <Card className="mb-2" bg="light">
                            <Card.Body>
                                <Card.Title>Sigma</Card.Title>
                                <Card.Text>
                                    Create and manage Sigma rules.
                                </Card.Text>
                                <Button variant="primary" onClick={() => navigate(`/sigma/home`)}>View</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col sm>
                        <Card className="mb-2" bg="light">
                            <Card.Body>
                                <Card.Title>Mitre</Card.Title>
                                <Card.Text>
                                    Explore Mitre data and mappings.
                                </Card.Text>
                                <Button variant="primary" onClick={() => navigate(`/mitre`)}>View</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    )
}