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
                            <Card.Title>Read PCAP</Card.Title>
                            <Card.Text>
                                Read PCAP using Snort
                            </Card.Text>
                            <Button variant="primary" onClick={() => navigate(`/snort/engine/pcap`)}>View</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}