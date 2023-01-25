import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import MitreDataService from '../../../services/mitre.service';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ReactMarkdown from 'react-markdown';
import ReactDom from 'react-dom';
import Spinner from 'react-bootstrap/Spinner';

export default function App() {
    const [subtechnique, setSubtechnique] = React.useState();

    const params = useParams();
    const navigate = useNavigate();

    React.useEffect(() => {
        MitreDataService.getSubtechnique(params.id).then( function (response) {
            setSubtechnique(response.data);
        }).catch(function (error) {
            if (error.response)
                {
                    console.log(error.response);
                }
        })
    }, []);

    if (!subtechnique) return (
        <Spinner className="mt-5" animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    )
    
    return (
        <Container>
            <Card className="text-center mt-3">
                <Card.Header>
                    Subtechnique Name
                    <h5>{subtechnique.id} {subtechnique.name}</h5>
                </Card.Header>
                <Card.Body>
                    <div className="input-group text-start">
                        <ReactMarkdown>{subtechnique.description}</ReactMarkdown>
                    </div>
                    <hr/>
                    
                </Card.Body>
                <Card.Footer className="text-muted"></Card.Footer>
            </Card>
            {subtechnique.references.map((reference) =>
            {
                return (
                    <>
                    {reference.url}
                    </>
                )
            })}
        </Container>
    )

}