import React from 'react';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';

export default function App(){

    const navigate = useNavigate();

    return(
    <>
        <Row className="">
            <Col>
                <Card border="dark" style={{ width: '30rem' }}>
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
                <Card border="dark" style={{ width: '30rem' }}>
                    <Card.Body>
                        <Card.Title>Add</Card.Title>
                        <Card.Text>
                            Add new Yara rules.
                        </Card.Text>
                        <Button variant="primary">View</Button>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </>

    )
}