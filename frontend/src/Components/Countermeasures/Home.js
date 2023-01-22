import React from 'react';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export default function App() {
    return (
        <>
            <Row xs={1} md={2} className="g-4">
                <Col>
                    <Card border="dark" style={{ width: '30rem' }}>
                        <Card.Body>
                            <Card.Title>Yara</Card.Title>
                            <Card.Text>
                                Create and manage Yara rules.
                            </Card.Text>
                            <Button variant="primary">View</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card border="dark" style={{ width: '30rem' }}>
                        <Card.Body>
                            <Card.Title>Snort</Card.Title>
                            <Card.Text>
                                Create and manage Snort rules.
                            </Card.Text>
                            <Button variant="primary">View</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card border="dark" style={{ width: '30rem' }}>
                        <Card.Body>
                            <Card.Title>Sigma</Card.Title>
                            <Card.Text>
                                Create and manage Sigma rules.
                            </Card.Text>
                            <Button variant="primary">View</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card border="dark" style={{ width: '30rem' }}>
                        <Card.Body>
                            <Card.Title>Mitre</Card.Title>
                            <Card.Text>
                                Explore Mitre data.
                            </Card.Text>
                            <Button variant="primary">View</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}