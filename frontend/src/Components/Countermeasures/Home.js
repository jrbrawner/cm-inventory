import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

export default function App() {

    const navigate = useNavigate();

    return (
        <Container className="mt-3">
            <Row md={4}>
                <Col xxl>
                    <Card className="mb-2" bg="light">
                            <Card.Body>
                                <Card.Title>Yara</Card.Title>
                                 <Card.Text>Create, manage Yara rules and view Yara tools.</Card.Text>
                            </Card.Body>
                            
                            <Card.Footer className="d-grid">
                                <Button variant="outline-warning" onClick={() => navigate(`/yara/home`)}>View</Button>
                            </Card.Footer>
                    </Card>
                </Col>
                <Col xxl>
                    <Card className="mb-2" bg="light">
                        <Card.Body>
                            <Card.Title>Snort</Card.Title>
                            <Card.Text>Create, manage Snort rules and view Snort tools.</Card.Text>
                        </Card.Body>
                        <Card.Footer className="d-grid">
                            <Button variant="outline-dark" onClick={() => navigate(`/snort/home`)}>View</Button>
                        </Card.Footer>
                    </Card>
                </Col>
                <Col xxl>
                    <Card className="mb-2" bg="light">
                        <Card.Body>
                            <Card.Title>Sigma</Card.Title>
                            <Card.Text>Create, manage Sigma rules and view Sigma tools.</Card.Text>
                        </Card.Body>
                        <Card.Footer className="d-grid">
                            <Button variant="outline-danger" onClick={() => navigate(`/sigma/home`)}>View</Button>
                        </Card.Footer>
                    </Card>
                </Col>
                <Col xxl>
                    <Card className="mb-2" bg="light">
                        <Card.Body>
                            <Card.Title>Mitre</Card.Title>
                            <Card.Text>Explore Mitre data, countermeasure mappings, and Mitre tools.</Card.Text>
                        </Card.Body>
                        <Card.Footer className="d-grid">
                            <Button variant="outline-primary" onClick={() => navigate(`/mitre`)}>View</Button>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
        
    )
}