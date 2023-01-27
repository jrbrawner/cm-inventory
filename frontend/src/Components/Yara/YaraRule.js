import React from 'react';
import  YaraDataService from '../../services/yara.service';
import { useParams, useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import Button from 'react-bootstrap/Button';
import ReactMarkdown from 'react-markdown';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';

export default function App() {
    const [yaraRule, setYaraRule] = React.useState();
    const params = useParams();
    const navigate = useNavigate();

    React.useEffect(() => {
        YaraDataService.get(params.id).then((response) => {
            setYaraRule(response.data);
            console.log(yaraRule.raw_text);
        }).catch(function (error) {
            if (error.response)
                {
                    console.log(error.response);
                }
        })
    }, []);

    function formatMitre(list, type) {
        var listString = [];
        if (list.length === 0) {
            listString.push("None");
        }
        list.map((listObject) => {
            listString.push(<a href={`/mitre/${type}/${listObject.id}`}>{listObject.name}</a>);
            listString.push("   ")
        })
        return (<>{listString}</>);
    }

    if (!yaraRule) return (
        <Spinner className="mt-5" animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    )

    return (
        <Container>
                    <div className="text-end">
                        <Button variant="outline-success">Test</Button>
                        <Button variant="outline-primary" onClick={() => navigate(`/yara/update/${yaraRule.id}`)}>Update</Button>
                        <Button variant="outline-danger">Delete</Button>
                    </div>
                    <Card className="text-center mt-3 bg-light">
                        <Card.Header>
                            Rule Name
                            <h5>{yaraRule.name}</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="input-group text-start">
                                <p>Rule Description: {yaraRule.description}</p>
                            </div>
                            <div className="text-start">
                                <p>Rule Text:</p>
                            </div>
                            <div>
                                <TextareaAutosize
                                disabled
                                className="container text-dark"
                                value={yaraRule.raw_text}/>
                            <hr/>
                            </div>
                        
                            <div className="input-group text-start">
                                <p>Rule Compiles: {yaraRule.compiles}</p>
                            </div>
                            <hr/>
                            <h5>Mitre Information</h5>

                            <div className="text-start">
                                Tactics - {formatMitre(yaraRule.tactics, "tactic")}
                            </div>

                            <div className="text-start">
                                Techniques - {formatMitre(yaraRule.techniques, "technique")}
                            </div>

                            <div className="text-start">
                                Subtechniques -  {formatMitre(yaraRule.subtechniques, "subtechnique")}
                            </div>
                            
                        </Card.Body>
                        <Card.Footer className="text-muted">Date Added {yaraRule.date_added}</Card.Footer>
                    </Card>
        </Container>
    )

}