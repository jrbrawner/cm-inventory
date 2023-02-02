import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import MitreDataService from '../../../services/mitre.service';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';


export default function App() {
    const [technique, setTechnique] = React.useState();
    const [markdown, SetMarkdown] = React.useState();
    

    const params = useParams();
    const navigate = useNavigate();
    const citationList = [];

    React.useEffect(() => {
        MitreDataService.getTechnique(params.id).then( function (response) {
            setTechnique(response.data);
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
        //this also effects [links] to other mitre resources
       
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
    
        SetMarkdown(string);
        return string;
    }

    if (!technique) return (
        <Spinner className="mt-5" animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    )
    
    
    return (
        <Container>
        <Card className="text-center mt-3">
            <Card.Header>
                Technique Name
                <h5>{technique.id} {technique.name}</h5>
            </Card.Header>
            <Card.Body>
                
                <div className="input-group text-start">
                    <ReactMarkdown children={markdown} remarkPlugins={[gfm]} className="markdown"/>
                </div>
                <h5>Associated Countermeasures</h5>
                <Row md={3}>     
                    <Col>
                        <Card className="mb-2" bg="light">
                            <Card.Body>
                                <Card.Title>Yara</Card.Title>
                                <Card.Text>
                                    View {technique.name} associated Yara rules.
                                </Card.Text>
                                <Button variant="outline-warning" onClick={() => navigate(`/mitre/countermeasure/yara/technique/${technique.id}`)}>View</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col sm>
                        <Card className="mb-2" bg="light">
                            <Card.Body>
                                <Card.Title>Snort</Card.Title>
                                <Card.Text>
                                    View {technique.name} associated Snort rules.
                                </Card.Text>
                                <Button variant="outline-dark">View</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col sm>
                        <Card className="mb-2" bg="light">
                            <Card.Body>
                                <Card.Title>Sigma</Card.Title>
                                <Card.Text>
                                    View {technique.name} associated Sigma rules.
                                </Card.Text>
                                <Button variant="outline-danger">View</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                
                <hr/>
                <h5>Associated Subtechniques</h5>
                <h6>{technique.subtechniques.length} Subtechniques</h6>
                <Row md={3}>
                    {technique.subtechniques.map((subtechnique) => {
                        return (
                            <Col key={subtechnique.id}>
                                <Card className="mb-2" bg="light">
                                    <Card.Header>{subtechnique.id}</Card.Header>
                                    <Card.Body>
                                        <Card.Title>{subtechnique.name}</Card.Title>
                                        <Card.Text>
                                        </Card.Text>
                                        <Button variant="primary" onClick={() => navigate(`/mitre/subtechnique/${subtechnique.id}`)}>View</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                    })}
                </Row>
            </Card.Body>
            <Card.Footer className="text-muted">
                <h5>References</h5>
                {technique.references.map((reference) => {
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