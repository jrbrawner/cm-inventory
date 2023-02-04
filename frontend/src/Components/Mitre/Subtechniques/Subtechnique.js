import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import MitreDataService from '../../../services/mitre.service';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ReactMarkdown from 'react-markdown';
import Spinner from 'react-bootstrap/Spinner';
import gfm from 'remark-gfm';

export default function App() {
    const [subtechnique, setSubtechnique] = React.useState();
    const [markdown, setMarkdown] = React.useState();

    const citationList = [];

    const params = useParams();
    const navigate = useNavigate();

    React.useEffect(() => {
        MitreDataService.getSubtechnique(params.id).then( function (response) {
            setSubtechnique(response.data);
            formatStringMarkdown(response.data['description'], response.data['references']);
        }).catch(function (error) {
            if (error.response)
                {
                    console.log(error.response);
                }
        })
    }, []);

    const formatStringMarkdown = (string, references) => {
        let index = 1;
        string = string.replaceAll("<code>", "```");
        string = string.replaceAll("</code>", "```");

        var temp = ""
        for (let i = 0; i < string.length; i++) {
            if (string[i] === '('){
                while (string[i] !== ')'){
                    temp += string[i];
                    i++;
                }
                temp += ")";
                citationList.push({id: index, citation:temp});
                index += 1;
            }
            temp = "";
        }
        //Getting rid of citations, may change later
        citationList.forEach(element => {
            if (element.citation.includes('Citation:')){
                string = string.replaceAll(element.citation, "");
            }
        });
        index = 1;

        for (let i = 0; i < references.length; i++){
            //references[i].url = `<a href="${references[i].url}">${references[i].url}</a>`
            references[i].id = index;
            index += 1;
        }
    
        setMarkdown(string);
        return string;
    }

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
                        <ReactMarkdown children={markdown} remarkPlugins={[gfm]}/>
                    </div>
                    <hr/>
                    <h5>Associated Countermeasures</h5>
                    <Row md={3}>     
                    <Col>
                        <Card className="mb-2" bg="light">
                            <Card.Body>
                                <Card.Title>Yara</Card.Title>
                                <Card.Text>
                                    View {subtechnique.name} associated Yara rules.
                                </Card.Text>
                                <Button variant="outline-warning" onClick={() => navigate(`/mitre/countermeasure/yara/subtechnique/${subtechnique.id}/1`)}>View</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col sm>
                        <Card className="mb-2" bg="light">
                            <Card.Body>
                                <Card.Title>Snort</Card.Title>
                                <Card.Text>
                                    View {subtechnique.name} associated Snort rules.
                                </Card.Text>
                                <Button variant="outline-dark" onClick={() => navigate(`/mitre/countermeasure/snort/subtechnique/${subtechnique.id}/1`)}>View</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col sm>
                        <Card className="mb-2" bg="light">
                            <Card.Body>
                                <Card.Title>Sigma</Card.Title>
                                <Card.Text>
                                    View {subtechnique.name} associated Sigma rules.
                                </Card.Text>
                                <Button variant="outline-danger" onClick={() => navigate(`/mitre/countermeasure/sigma/subtechnique/${subtechnique.id}/1`)}>View</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                    
                </Card.Body>
                <Card.Footer className="text-muted">
                <h5>References</h5>
                {subtechnique.references.map((reference) => {
                    return (
                        
                        <div className="text-start" key={reference.id}>
                            <p>{reference.id}: <a href={reference.url}>{reference.url}</a></p>
                        </div>
                    )
                    
                })}
            </Card.Footer>
            </Card>
        </Container>
    )

}