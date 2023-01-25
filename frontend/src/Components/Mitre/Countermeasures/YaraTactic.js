import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import MitreDataService from '../../../services/mitre.service';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export default function App() {
    const [rules, setRules] = React.useState();

    const params = useParams();
    const navigate = useNavigate();

    React.useEffect(() => {
        MitreDataService.getTacticYara(params.id).then( function (response) {
            setRules(response.data);
        }).catch(function (error) {
            if (error.response)
                {
                    console.log(error.response);
                }
        })
    }, []);

    if (!rules) return <p>Loading...</p>
    
    return (
        <Container>
            <h5>{params.id} Associated Yara Rules</h5>
            <hr/>
            <Row md={1}>     
                    {rules.map((rule) => {
                        return (
                            <Col>
                                <Card className="mb-2" bg="light">
                                    <Card.Body>
                                        <Card.Title>{rule.name}</Card.Title>
                                        <Card.Text>
                                            {rule.description} 
                                        </Card.Text>
                                        <Button variant="outline-primary" onClick={() => navigate(`/yara/${rule.id}`)}>View</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                    })}
            </Row>
        </Container>
    )
}