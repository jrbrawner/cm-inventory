import React from 'react';
import  YaraDataService from '../../services/yara.service';
import { useParams, useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import AutoSizeTextArea from '../../Custom/AutoSizeTextArea';
import Button from 'react-bootstrap/Button';

export default function App() {
    const [yaraRule, setYaraRule] = React.useState();
    const params = useParams();
    const navigate = useNavigate();

    React.useEffect(() => {
        YaraDataService.get(params.id).then((response) => {
            setYaraRule(response.data);
        }).catch(function (error) {
            if (error.response)
                {
                    console.log(error.response);
                }
        })
    }, []);

    if (!yaraRule) return <p>Loading...</p>

    return (
        <>
                    <div className="text-end">
                        <Button variant="outline-success">Test</Button>
                        <Button variant="outline-primary">Update</Button>
                        <Button variant="outline-danger">Delete</Button>
                    </div>
                    <Card className="text-center mt-3">
                        
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
                                <AutoSizeTextArea
                                className="container"
                                value={yaraRule.raw_text}/>
                                    
                            </div>
                            <div className="input-group text-start">
                                <p>Rule Compiles: {yaraRule.compiles}</p>
                            </div>
                            <hr/>
                            <h5>Mitre Information</h5>

                            <div className="text-start">
                                <h5>Tactics</h5>
                                {yaraRule.tactics.map((tactic) => {
                                    return (
                                        <p>
                                            {tactic.id} | {tactic.name}
                                        </p>
                                    )
                                })}
                                
                            </div>

                            <div className="input-group text-start">
                                <p>{yaraRule.techniques.map((technique) => {
                                    return (
                                        <p>Techniques: {technique.name}</p>
                                    )
                                })}</p>
                            </div>
                            <div className="input-group text-start">
                                <p>{yaraRule.subtechniques.map((subtechnique) => {
                                    return (
                                        <p>Subtechniques: {subtechnique.name}</p>
                                    )
                                })}</p>
                            </div>
                            
                        </Card.Body>
                        <Card.Footer className="text-muted">Date Added {yaraRule.date_added}</Card.Footer>
                    </Card>
        </>
    )

}