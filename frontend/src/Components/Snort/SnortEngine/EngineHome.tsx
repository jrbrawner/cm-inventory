import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import SnortEngineService from '../../../services/snort-engine.service';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';

export default function App(){

    const [status, setStatus] = React.useState<any>({});
    
    const navigate = useNavigate();

    React.useEffect(() => {
        SnortEngineService.checkStatus().then((response) => {
            setStatus(response.data);
        })
    }, [])

    if (!status) return (
        <Spinner className="mt-5" animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    )

    return(
        <Container className="mt-2">
            <ListGroup className="mb-2">
                <ListGroup.Item variant={status.variant}>Snort Engine is {status.result}</ListGroup.Item>
            </ListGroup>
            <Row md={3}>
                <Col>
                    <Card className="mb-2" bg="light">
                        <Card.Body>
                            <Card.Title>Read PCAP</Card.Title>
                            <Card.Text>
                                Read PCAP using Snort.
                            </Card.Text>
                            <Button variant="primary" onClick={() => navigate(`/snort/engine/read-pcap`)}>View</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card className="mb-2" bg="light">
                        <Card.Body>
                            <Card.Title>Analyze PCAP</Card.Title>
                            <Card.Text>
                                Analyze PCAP using stored Snort rules.
                            </Card.Text>
                            <Button variant="primary" onClick={() => navigate(`/snort/engine/analyze-pcap`)}>View</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}