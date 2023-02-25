import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

export default function App(){
    
    const navigate = useNavigate();

    return(
       
        <Container className="mt-2">
            <Row md={3}>
                <Col>
                    <Card className="mb-2" bg="light">
                        <Card.Body>
                            <Card.Title>Search</Card.Title>
                            <Card.Text>
                                Search for stored Snort rules.
                            </Card.Text>
                            <Button variant="primary" onClick={() => navigate(`/snort/search`)}>View</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card className="mb-2" bg="light">
                        <Card.Body>
                            <Card.Title>Upload</Card.Title>
                            <Card.Text>
                                Upload new Snort rules.
                            </Card.Text>
                            <Button variant="primary" onClick={() => navigate(`/snort/create`)}>View</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card className="mb-2" bg="light">
                        <Card.Body>
                            <Card.Title>Rule Builder</Card.Title>
                            <Card.Text>
                                Build new rules, deconstruct existing ones, and test rule compilation.
                            </Card.Text>
                            <Button variant="primary" onClick={() => navigate(`/snort/rule-builder`)}>View</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card className="mb-2" bg="light">
                        <Card.Body>
                            <Card.Title>Snort Engine</Card.Title>
                            <Card.Text>
                                Utilize capabilities of virtualized snort appliance running in Docker container.
                            </Card.Text>
                            <Button variant="primary" onClick={() => navigate(`/snort/engine/home`)}>View</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}