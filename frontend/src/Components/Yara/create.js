import React from 'react';
import  YaraDataService from '../../services/yara.service';
import { useParams, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

export default function App(){

    const [ruleText, setRuleText] = React.useState();
    const [file, setFile] = React.useState();
    const [validated, setValidated] = React.useState(true);
    const [result, setResult] = React.useState();

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
          formatResults(error.data);
        })
      }
    }

    function formatResults(list) {
      var resultString = ""
      list.map((item) => {
        resultString += item.msg;
        resultString += "\n"; 
      })
      setResult(resultString);
    }
    

    return (
            <Container>
              <h5 className="mt-3">Upload a file of Yara rules or enter Yara rules in the text box below.</h5>
              <div className="mt-3">
                <Form onSubmit={handleSubmit}>
                  <div className="d-flex justify-content-center">
                    <Form.Control onChange={handleFile} className="w-50" type="file" required={validated}/>
                  </div>
                  <Form.Group className="mt-3 mb-1">
                    <textarea
                      className="w-50"
                      name="rules-text"
                      rows={15}
                      required={validated}
                      placeholder="Enter rules here..."
                      style={{ width: 200 }}
                      onChange={handleInput}
                    />

                  </Form.Group>

                  <Button type="submit">Submit</Button>
                </Form>
                </div>
                <div>
                <textarea value={result}>
                </textarea>
                </div>
            </Container>
            
    )
}