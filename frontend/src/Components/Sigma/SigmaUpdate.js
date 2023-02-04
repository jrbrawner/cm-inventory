import React from 'react';
import SigmaDataService from '../../services/sigma.service';
import { useParams, useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ReactMarkdown from 'react-markdown';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import EditFormDialogModal from '../../Custom/EditFormDialogModal';
import CommonUtils from '../../lib/utils';

export default function App() {

    const [sigmaRule, setSigmaRule] = React.useState();
    const [ruleText, setRuleText] = React.useState();
    const [file, setFile] = React.useState();
    const params = useParams();
    const navigate = useNavigate();

    React.useEffect(() => {
        SigmaDataService.get(params.id).then((response) => {
            setSigmaRule(response.data);
            setRuleText(response.data['raw_text']);
        }).catch(function (error) {
            if (error.response)
                {
                    console.log(error.response);
                }
        })
    }, []);

    const handleChange = (event) => {
        event.preventDefault();
        setRuleText(event.target.value);
    }

    const handleFile = event => {
        setFile(event.target.files[0]);
      }

    const handleSubmit = (event) => {
    event.preventDefault();
    if (file !== undefined) {
        const formData = new FormData();
        formData.append("file", file);
        SigmaDataService.update(sigmaRule.id, formData).then(function (response) {
            navigate(`/sigma/${sigmaRule.id}`);
            }).catch(function (error) {
                alert(error);
            })
            
        }
        else{
        //rule text wip
        const formData = new FormData();
        formData.append("rules_text", ruleText);
        SigmaDataService.createText(formData).then(function (response) {
        navigate(`/sigma/${sigmaRule.id}`);
        }).catch(function (error) {
        alert(error);
        })
        }
    }
    
    if (!sigmaRule) return (
        <Spinner className="mt-5" animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    )

    if (!ruleText) return (
        <Spinner className="mt-5" animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    )

    return (
        <Container>
                    <Form onSubmit={handleSubmit} id="updateRuleForm">
                        <Card className="text-center mt-3 bg-light">
                            <Card.Header>
                                <h5>Upload file of modified rule to update it.</h5>
                            </Card.Header>

                            <div className="d-flex justify-content-center mt-3">
                                <Form.Control onChange={handleFile} className="w-50" type="file" required/>
                            </div>

                            <Card.Body>
                                    <div>
                                       <TextareaAutosize
                                       id="rules-text"
                                       className="container"
                                       disabled
                                       onKeyDown={CommonUtils.handleTab}
                                       onChange={handleChange}
                                       defaultValue={ruleText}/>
                                    </div>
                            </Card.Body>
                            <Card.Footer className="text-muted">Date Added {CommonUtils.formatTime(sigmaRule.date_added)}</Card.Footer>
                        </Card>
                        <div className="mt-2 d-grid gap-2">
                            <EditFormDialogModal buttonName={"Submit"} modalTitle={"Update Sigma Rule"}
                            modalBody={"Are you sure you want to make these changes to this Sigma rule?"}
                            form={"updateRuleForm"}/>
                        </div>
                    </Form>
        </Container>
    )

}