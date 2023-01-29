import React from 'react';
import  YaraDataService from '../../services/yara.service';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

export default function App(){

    const [ruleText, setRuleText] = React.useState();
    const [file, setFile] = React.useState();
    const [validated, setValidated] = React.useState(true);
    const [results, setResults] = React.useState();

    const handleInput = event  => {
      setRuleText(event.target.value);
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
        YaraDataService.createFile(formData).then(function (response) {
          formatResults(response.data);
        }).catch(function (error) {
          formatResults(error.data);
        })
        
      }
      else{
        const formData = new FormData();
        formData.append("rules_text", ruleText);
        YaraDataService.createText(formData).then(function (response) {
          formatResults(response.data);
        }).catch(function (error) {
          alert(error);
        })
      }
    }

    function formatResults(list) {
      console.log(list);
      var resultList = []
      var index = 0;
      list.map((item) => {
        resultList.push({id: index, result: item.msg, variant: item.variant}) 
        index += 1;
      })
      setResults(resultList);
    }

    function handleTab(e) {
      if (e.key == 'Tab') {
        e.preventDefault();
        var textarea = document.getElementById('rules-text');
        textarea.value += "\t";
      }
    }

    return (
            <Container className="mb-5">
              <div className="input-group d-flex justify-content-center">
                <h5 className="mt-3">Upload a file of Yara rules or enter Yara rules in the text box below.</h5>
                <OverlayTrigger
                          trigger="click"
                          key={"bottom"}
                          placement={"bottom"}
                          overlay={
                            <Popover>
                              <Popover.Header as="h3">Yara Rule Example</Popover.Header>
                              <Popover.Body>
                                <p>To ensure mitre information and other meta fields are correctly parsed from each rule, the rule meta should be structured like this:</p>
                                <Container>
                                    <div>
                                      <p>
                                        rule ExampleRule &#123;<br/>
                                        meta:<br/>
                                        &emsp;author = "Josh Brawner"<br/>
                                        &emsp;description = "This is an example."<br/>
                                        &emsp;version = "0.1"<br/>
                                        &emsp;tactic = "TA0006, TA0002"<br/>
                                        &emsp;technique = "T1212"<br/>
                                        &emsp;subtechnique = "T1055.003"<br/>
                                        strings:<br/>
                                        &emsp;$c1 = "OpenProcess"<br/>
                                        condition:<br/>
                                        &emsp;$c1<br/>
                                        &#125;
                                      </p>
                                    </div>
                                  </Container>
                              </Popover.Body>
                            </Popover>
                          }
                        >
                      <Button className="shadow-none mt-2" variant=""><span><FontAwesomeIcon icon={faCircleInfo} /></span></Button>
                    </OverlayTrigger>
              </div>
              <div className="mt-3">
                <Form onSubmit={handleSubmit}>
                  <div className="d-flex justify-content-center">
                    <Form.Control onChange={handleFile} className="w-50" type="file" required={validated}/>
                  </div>
                  <Form.Group className="mt-3 mb-1">

                    <textarea
                      className="w-50"
                      id="rules-text"
                      name="rules-text"
                      rows={15}
                      required={validated}
                      placeholder="Enter rules here..."
                      style={{ width: 200 }}
                      onChange={handleInput}
                      onKeyDown={handleTab}
                    />

                  </Form.Group>
                  <div className="d-flex justify-content-center mt-3">
                    <div className="w-50">
                        <div className="d-grid gap-2">
                            <Button className="" variant="primary" type="submit">Submit</Button>
                        </div>
                    </div>
                </div>
                </Form>
                </div>
                <hr/>
                <div>
                {results &&
                  <ListGroup className="mt-2">
                    {results.map((result) => {
                      return (
                        <ListGroup.Item key={result.id} variant={result.variant}>{result.result}</ListGroup.Item>
                      )
                    })}
                  </ListGroup>
                }
                </div>
            </Container>
            
    )
}