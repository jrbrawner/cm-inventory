import React from 'react';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Accordion from 'react-bootstrap/Accordion';
import ListGroup from 'react-bootstrap/ListGroup';

export default function App() {

    const navigate = useNavigate();
    
    return (
        
        <Container className="mt-2">
            <Row>
                <Col>
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Model</Accordion.Header>
                    
                        </Accordion.Item>
                    </Accordion>
                </Col>
                <Col>
                    <Accordion>
                        <Accordion.Header>Harden</Accordion.Header>
                    </Accordion>
                </Col>
                <Col>
                    <Accordion>
                        <Accordion.Header>Detect</Accordion.Header>
                    </Accordion>
                </Col>
                <Col>
                    <Accordion>
                        <Accordion.Header>Isolate</Accordion.Header>
                    </Accordion>
                </Col>
                <Col>
                    <Accordion>
                        <Accordion.Header>Deceive</Accordion.Header>
                    </Accordion>
                </Col>
                <Col>
                    <Accordion>
                        <Accordion.Header>Evict</Accordion.Header>
                    </Accordion>
                </Col>
            </Row>
        </Container>
    
    )
}