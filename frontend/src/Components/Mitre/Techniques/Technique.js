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
import remarkGfm from 'remark-gfm';

export default function App() {
    const [technique, setTechnique] = React.useState();

    const params = useParams();
    const navigate = useNavigate();
    const citationList = []

    var idk = "Here is a simple footnote[^1]. With some additional text after it.\n [^1]: My reference."

    React.useEffect(() => {
        MitreDataService.getTechnique(params.id).then( function (response) {
            setTechnique(response.data);

        }).catch(function (error) {
            if (error.response)
                {
                    console.log(error.response);
                }
        })
    }, []);

    function formatStringMarkdown(string) {
        
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
        citationList.forEach(element => {
            string = string.replaceAll(element.citation, `[^${element.id}]`);
        });
    
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
                        <ReactMarkdown children={formatStringMarkdown(technique.description)} remarkPlugins={[remarkGfm]}/>
                    </div>
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
                <Card.Footer className="text-muted">{technique.reference}</Card.Footer>
            </Card>
            <ReactMarkdown children={idk} remarkPlugins={[remarkGfm]}/>
            
            {citationList.map((element) => {
                return (
                    <>
                        <div>
                            <ReactMarkdown children={`[^${element.id}]:` My reference} remarkPlugins={[remarkGfm]} />
                        
                        </div>
                    </>
                )
            })}

            {/*}
            {technique.references.map((reference) =>
            {
                return (
                    <>
                    <div>
                        {reference.url}
                    </div>
                    </>
                )
            })}
        {*/}
        </Container>
    )

}