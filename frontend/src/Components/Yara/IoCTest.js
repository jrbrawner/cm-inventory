import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import YaraDataService from '../../services/yara.service';
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import ListGroup from 'react-bootstrap/ListGroup';

export default function App(){

    const [yaraRule, setYaraRule] = React.useState();
    const [iocText, setIOCText] = React.useState();
    const [file, setFile] = React.useState();
    const [validated, setValidated] = React.useState(true);
    const [results, setResults] = React.useState();

    const params = useParams();

    React.useEffect(() => {
        YaraDataService.get(params.id).then(function (response) {
            setYaraRule(response.data);
        }).catch(function (error){
            if (error.response){
                alert(error);
            }
        })
    }, []);

    const handleInput = event  => {
        setIOCText(event.target.value);
        setValidated(false);
        if (event.target.value === ""){
          setValidated(true);
        }
      }

    const handleFile = event => {
        setFile(event.target.files[0]);
        setValidated(false);
      }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (file !== undefined) {
        const formData = new FormData();
        formData.append("file", file);
        YaraDataService.test(yaraRule.id, formData).then(function (response) {
            formatResults(response.data);
        }).catch(function (error) {
            formatResults(error.data);
        })
        
        }
        else{
        const formData = new FormData();
        formData.append("ioc_text", iocText);
        YaraDataService.test(yaraRule.id, formData).then(function (response) {
            formatResults(response.data);
        }).catch(function (error) {
            formatResults(error.data);
        })
        }
    }

    function formatResults(list) {
    var result = []
    if (list['msg'].length === 0){
        result.push({id: 0, result: 'IoC not detected.', variant: 'danger'}) 
        setResults(result);
    }
    else{
        var index = 0;
        result.push({id: index, result: 'IoC detected.', variant: 'success'})
        list['msg'].map((item) => {
            index += 1;
            var string = `Data "${item.data}" matched at offset ${item.offset} using string: ${item.identifier}.`
            result.push({id : index, result: string}); 
        })
        setResults(result);
    }
    }

    if (!yaraRule) return (
        <Spinner className="mt-5" animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    )

    return (
        <Container className="mb-5">
                    <Form onSubmit={handleSubmit} id="updateRuleForm">
                        <Card className="mt-3 bg-light">
                            <Card.Header>
                                <h5>Insert IoC's under the rule or upload a file to test detection.</h5>
                            </Card.Header>
                            <div className="ms-3 mt-3 text-start">
                                <h6>Does Rule Compile? {yaraRule.compiles}</h6>
                            </div>
                            <Card.Body>
                                <div>
                                    <TextareaAutosize
                                    id="textarea"
                                    className="container"
                                    disabled
                                    defaultValue={yaraRule.raw_text}/>
                                </div>
                                <hr/>
                                <div>
                                    <h5>IOC Text</h5>
                                    <TextareaAutosize id="ioc_text"
                                        onChange={handleInput}
                                        className="w-50"
                                        required={validated}
                                    />
                                </div>
                                <h5 className="mt-3">IoC File</h5>
                                <div className="d-flex justify-content-center">
                                    <Form.Control onChange={handleFile} className="w-50" type="file" required={validated}/>
                                </div>
                                <div className="d-flex justify-content-center mt-3">
                                    <div className="w-50">
                                        <div className="d-grid gap-2">
                                            <Button className="" variant="primary" type="submit">Submit</Button>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                            <Card.Footer className="text-muted">Date Added {yaraRule.date_added}</Card.Footer>
                            <div>
                            {results &&
                            <ListGroup className="mt-2">
                                {results.map((result) => {
                                return (
                                    <ListGroup.Item variant={result.variant} key={result.id}>{result.result}</ListGroup.Item>
                                )
                                })}
                            </ListGroup>
                            }
                            </div>
                        </Card>
                    </Form>
        </Container>
    );
}