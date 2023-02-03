import React from 'react';
import  YaraDataService from '../../services/yara.service';
import { useParams, useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import AutoSizeTextArea from '../../Custom/AutoSizeTextArea';
import Button from 'react-bootstrap/Button';
import ReactMarkdown from 'react-markdown';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import EditFormDialogModal from '../../Custom/EditFormDialogModal';
import CommonUtils from '../../lib/utils';

export default function App() {
    const [yaraRule, setYaraRule] = React.useState();
    const [ruleText, setRuleText] = React.useState();
    const params = useParams();
    const navigate = useNavigate();

    React.useEffect(() => {
        YaraDataService.get(params.id).then((response) => {
            setYaraRule(response.data);
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

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('rule_text', ruleText);

        YaraDataService.update(yaraRule.id, formData).then(function (response) {
            if (response.status === 200){
                navigate(`/yara/${yaraRule.id}`);
            }
        }).catch(function (error) {
            alert(error);
        })
    
    }
    
    if (!yaraRule) return (
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
                                <h5>Change rule and submit to update.</h5>
                            </Card.Header>
                            <Card.Body>
                                    <div>
                                       <TextareaAutosize
                                       id="rules-text"
                                       className="container"
                                       onKeyDown={CommonUtils.handleTab}
                                       onChange={handleChange}
                                       defaultValue={ruleText}/>
                                    </div>
                            </Card.Body>
                            <Card.Footer className="text-muted">Date Added {CommonUtils.formatTime(yaraRule.date_added)}</Card.Footer>
                        </Card>
                        <div className="mt-2 d-grid gap-2">
                            <EditFormDialogModal buttonName={"Submit"} modalTitle={"Update Yara Rule"}
                            modalBody={"Are you sure you want to make these changes to this Yara rule?"}
                            form={"updateRuleForm"}/>
                        </div>
                    </Form>
        </Container>
    )

}