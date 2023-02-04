import React from 'react';
import SigmaDataService from '../../services/sigma.service';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import CommonUtils from '../../lib/utils';

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
      setFile(event.target.files);
      setValidated(false);
    }
    
    const handleSubmit = (event) => {
      event.preventDefault();
      if (file !== undefined) {
          const formData = new FormData();
          for (let i = 0; i < file.length; i++){
            formData.append("files", file[i]);
          }
          SigmaDataService.createFile(formData).then(function (response) {
              formatResults(response.data);
            }).catch(function (error) {
                alert(error);
            })
            
        }
        else{
        //rule text wip
        const formData = new FormData();
        formData.append("rules_text", ruleText);
        SigmaDataService.createText(formData).then(function (response) {
          formatResults(response.data);
        }).catch(function (error) {
          alert(error);
        })
      }
    }

    function formatResults(list) {

      var resultList = []
      var index = 0;
      list.map((item) => {
        resultList.push({id: index, result: item.msg, variant: item.variant}) 
        index += 1;
      })
      setResults(resultList);
    }

    return (
            <Container className="mb-5">
              <div className="input-group d-flex justify-content-center">
                <h5 className="mt-3">Upload files of Sigma rules or enter Sigma rules in the text box below.</h5>
                <OverlayTrigger
                          trigger="click"
                          key={"bottom"}
                          placement={"bottom"}
                          overlay={
                            <Popover>
                              <Popover.Header as="h3">Sigma Rule Example</Popover.Header>
                              <Popover.Body>
                                <p>Mitre information should be included in the 'tags' section of the sigma rule, like below:</p>
                                <div>
                                tags:<br/>
                                - attack.initial_access<br/>
                                - attack.t1190<br/>
                                - attack.t1505.003<br/>
                                - cve.2014.6287<br/>
                                </div>
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
                    <Form.Control onChange={handleFile} className="w-50" type="file" multiple required={validated}/>
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
                      onKeyDown={CommonUtils.handleTab}
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