import React from 'react';
import  SigmaDataService from '../../services/sigma.service';
import { useParams, useNavigate} from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import DeleteDialogModal from '../../Custom/DeleteDialogModal';
import CommonUtils from '../../lib/utils';

export default function App() {
    const [sigmaRule, setSigmaRule] = React.useState();

    const params = useParams();
    const navigate = useNavigate();

    const [ruleString, setRuleString] = React.useState();
    
    React.useEffect(() => {
        SigmaDataService.get(params.id).then((response) => {
            setSigmaRule(response.data);
            //SigmaDataService.rebuildRule(params.id).then((response) => {
            //    setRuleString(response.data);
            //})
            
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
    
    const deleteRule = () => {
        SigmaDataService.delete(sigmaRule.id).then( function (response) {
            navigate(`/sigma/search`);
        }).catch(function (error) {
            alert(error);
        })
    }

    if (!sigmaRule) return (
        <Spinner className="mt-5" animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    )

    

    return (
        <Container>
                    <div className="text-end">
                        <Button variant="outline-primary" onClick={() => navigate(`/sigma/update/${sigmaRule.id}`)}>Update</Button>
                        
                        <DeleteDialogModal buttonName={"Delete"} modalTitle={"Delete Sigma Rule"}
                         modalBody={"Are you sure you want to delete this rule? All information regarding this rule will be lost. This action cannot be undone."}
                        onSuccess={deleteRule}/>

                    </div>
                    <Card className="text-center mt-3 bg-light">
                        <Card.Header>
                            Rule Name
                            <h5>{sigmaRule.title}</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="input-group text-start">
                                
                            </div>
                            <div className="text-start">

                                <p>Rule Description: {sigmaRule.description}</p>
                            </div>
                            <div className="text-start">
                                <p>Rule Text:</p>
                            </div>
                            <div>
                            <TextareaAutosize
                            disabled
                            className="container text-dark"
                            value={sigmaRule.raw_text}/>
                            <hr/>
                            </div>
                            
                            <h5>Mitre Information</h5>

                            <div className="text-start">
                                Tactics - {formatMitre(sigmaRule.tactics, "tactic")}
                            </div>

                            <div className="text-start">
                                Techniques - {formatMitre(sigmaRule.techniques, "technique")}
                            </div>

                            <div className="text-start">
                                Subtechniques -  {formatMitre(sigmaRule.subtechniques, "subtechnique")}
                            </div>
                            
                        </Card.Body>
                        <Card.Footer className="text-muted">Date Added {CommonUtils.formatTime(sigmaRule.date_added)}</Card.Footer>
                    </Card>
        </Container>
    )

}