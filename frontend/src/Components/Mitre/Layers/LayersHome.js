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
                            <Card.Title>Generate Layer</Card.Title>
                            <Card.Text>
                                Generate MITRE Layers based on countermeasure coverage. 
                            </Card.Text>
                            <Button variant="primary" onClick={() => navigate(`/mitre/layer/create`)}>View</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card className="mb-2" bg="light">
                        <Card.Body>
                            <Card.Title>Test</Card.Title>
                            <Card.Text>
                                Test
                            </Card.Text>
                            <Button variant="primary" onClick={() => navigate(`/mitre/techniques`)}>View</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
        
    )
}