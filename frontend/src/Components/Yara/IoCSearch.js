import React from 'react';
import  YaraDataService from '../../services/yara.service';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';

export default function App(){

    const [iocText, setIOCText] = React.useState();
    const [file, setFile] = React.useState();
    const [validated, setValidated] = React.useState(true);
    const [results, setResults] = React.useState();

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
        YaraDataService.testAllIOC(formData).then(function (response) {
          formatResults(response.data);
        }).catch(function (error) {
          alert(error);
        })
        
      }
      else{
        const formData = new FormData();
        formData.append("ioc_text", iocText);
        YaraDataService.testAllIOC(formData).then(function (response) {
          formatResults(response.data);
        }).catch(function (error) {
          alert(error);
        })
      }
    }

    function formatResults(list) {
      var resultList = []
      var index = 0;
      resultList.push({id: index, result: list['rules_tested'] + ' Yara rules tested.', variant: "warning"})
      index += 1;
      list['msg'].map((item) => {
        if (item['rule_name'] !== undefined){
            console.log(item);
            index += 1;
            resultList.push({id: index, result: `Match found with Yara rule ${item['rule_name']}.`, variant: "success"})
            item['results'].map((match) => {
              index += 1;
              console.log(match);
              var string = `Data "${match[2]}" matched at offset ${match[0]} using string: ${match[1]}.`
              resultList.push({id:index, result: string, variant: "secondary"})
            })
        }
      })
      if (resultList.length === 1){
        index += 1;
        resultList.push({id: index, result: 'No stored yara rules detected the submitted IoCs.', variant: "danger"})
      }
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
                <h5 className="mt-3">Insert IoC's under the rule or upload a file to test detection using every stored Yara rule.</h5>
                <h6>Note: Rules that do not have a successful compilation status will not be utilized.</h6>
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