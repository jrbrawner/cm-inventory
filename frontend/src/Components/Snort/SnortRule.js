import React from 'react';
import  SnortDataService from '../../services/snort.service';
import { useParams, useNavigate} from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import DeleteDialogModal from '../../Custom/DeleteDialogModal';
import CommonUtils from '../../lib/utils';

export default function App() {
    const [snortRule, setSnortRule] = React.useState();
    const params = useParams();
    const navigate = useNavigate();


    React.useEffect(() => {
        SnortDataService.get(params.id).then((response) => {
            setSnortRule(response.data);
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
        SnortDataService.delete(snortRule.id).then( function (response) {
            navigate(`/snort/search`);
        }).catch(function (error) {
            alert(error);
        })
    }

    if (!snortRule) return (
        <Spinner className="mt-5" animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    )

    return (
        <Container>
                    <div className="text-end">
                        <Button variant="outline-primary" onClick={() => navigate(`/snort/update/${snortRule.id}`)}>Update</Button>
                        
                        <DeleteDialogModal buttonName={"Delete"} modalTitle={"Delete Snort Rule"}
                         modalBody={"Are you sure you want to delete this rule? All information regarding this rule will be lost. This action cannot be undone."}
                        onSuccess={deleteRule}/>

                    </div>
                    <Card className="text-center mt-3 bg-light">
                        <Card.Header>
                            Rule Name
                            <h5>Snort rules dont have rule names lol</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="input-group text-start">
                                
                            </div>
                            <div className="text-start">
                                <p>Rule Text:</p>
                            </div>
                            <div>
                                <TextareaAutosize
                                disabled
                                className="container text-dark"
                                value="work in progress"/>
                            <hr/>
                            </div>
                        
                            <div className="input-group text-start">
                                <p>Rule Compiles:</p>
                            </div>
                            <hr/>
                            <h5>Mitre Information</h5>

                            <div className="text-start">
                                Tactics - {formatMitre(snortRule.tactics, "tactic")}
                            </div>

                            <div className="text-start">
                                Techniques - {formatMitre(snortRule.techniques, "technique")}
                            </div>

                            <div className="text-start">
                                Subtechniques -  {formatMitre(snortRule.subtechniques, "subtechnique")}
                            </div>
                            
                        </Card.Body>
                        <Card.Footer className="text-muted">Date Added {CommonUtils.formatTime(snortRule.date_added)}</Card.Footer>
                    </Card>
        </Container>
    )

}