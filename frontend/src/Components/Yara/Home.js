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
        <>
            <Container className="mt-2">
                <Row md={3}>
                    <Col>
                        <Card className="mb-2" bg="light">
                            <Card.Body>
                                <Card.Title>Search</Card.Title>
                                <Card.Text>
                                    Search for stored Yara rules.
                                </Card.Text>
                                <Button variant="primary" onClick={() => navigate(`/yara/search`)}>View</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="mb-2" bg="light">
                            <Card.Body>
                                <Card.Title>Upload</Card.Title>
                                <Card.Text>
                                    Upload new Yara rules.
                                </Card.Text>
                                <Button variant="primary" onClick={() => navigate(`/yara/create`)}>View</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="mb-2" bg="light">
                            <Card.Body>
                                <Card.Title>IoC Detection</Card.Title>
                                <Card.Text>
                                    Search stored Yara rules for IoC detection.
                                </Card.Text>
                                <Button variant="primary" onClick={() => navigate(`/yara/ioc/search`)}>View</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>

    )
}