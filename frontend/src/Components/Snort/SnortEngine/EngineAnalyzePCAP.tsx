import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import SnortEngineService from '../../../services/snort-engine.service';
import Terminal, { ColorMode, TerminalOutput } from 'react-terminal-ui';
import Spinner from 'react-bootstrap/Spinner';
import CommonUtils from '../../../lib/utils';

export default function App(){

    const [file, setFile] = React.useState<any>();
    const [ruleFile, setRuleFile] = React.useState<any>();
    const [results, setResults] = React.useState<string>("");
    const [selection, setSelection] = React.useState<string>("");
    const [fileName, setFileName] = React.useState<string>("");
    const [validated, setValidated] = React.useState(true);
    const [ruleText, setRuleText] = React.useState();

    const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
      setFile(event.target.files);
    }
    
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault();
      
      const formData = new FormData();
      formData.append("pcap_file", file[0]);

      if (selection === "stored"){
        SnortEngineService.analyzePcapAll(formData).then((response) => {
          setResults(response.data);
        })
      }
      
      if (selection === "new"){
        if (ruleFile !== undefined){
          for (let i = 0; i < ruleFile.length; i++){
            formData.append("files", ruleFile [i]);
          }
          SnortEngineService.analyzePcapInput(formData).then((response) => {
            setResults(response.data);
          })
        }

        else if (ruleText !== undefined){
          formData.append("rule_text", ruleText);
          SnortEngineService.analyzePcapInput(formData).then((response) => {
            setResults(response.data);
          })
        }
      }
    }

    const handleRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.id == "stored-rule"){
          setSelection("stored");
        }
        else if (event.target.id == "new-rule"){
          setSelection("new");
        }
    }

    const handleInput = (event : React.ChangeEvent<HTMLInputElement>) => {
      setFileName(event.target.value);
    }

    const handleRuleText = (event : any)  => {
      setRuleText(event.target.value);
      setValidated(false);
      if (event.target.value === ""){
        setValidated(true);
      }
    }

    const handleRuleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRuleFile(event.target.files);
      setValidated(false);
    }

    function saveResults(){
        const blob = new Blob([results], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `${fileName}.txt`;
        link.href = url;
        link.click();
    }

    const displayInput = () => {
      if (selection === "stored"){
        return (
            <div>
            </div>
        )
      }

      if (selection === "new"){
        return (
          <div>
                <h5>Upload Rule File or Enter Snort Rules in Textbox</h5>
                <Form.Group className="text-start">
                  <Form.Label>Rules File</Form.Label>
                  <Form.Control onChange={handleRuleFile} type="file" multiple required={validated}/>
                </Form.Group>
                  <Form.Group className="mt-3 mb-1">
                    <textarea
                        className="container"
                        id="rules-text"
                        name="rules-text"
                        rows={15}
                        required={validated}
                        placeholder="Enter rules here..."
                        onChange={handleRuleText}
                        onKeyDown={CommonUtils.handleTab}
                    />
                  </Form.Group>
            </div>
        )
      }
    }

    return (
      <Container>
          <div className="d-flex justify-content-center">
              <div className="w-50 mt-3">
                  <h5>Upload PCAP File and Specify Rules To Be Used For Detection</h5>
                  <Form onSubmit={handleSubmit}>
                      <Form.Group className="mt-3 mb-3 text-start" controlId="">
                        <Form.Label>PCAP File</Form.Label>
                        <Form.Control onChange={handleFile} type="file" required/>
                      </Form.Group>
                      <Form.Group className="mt-3 mb-3 text-start" controlId="">
                      <Form.Check 
                          type="radio"
                          id="stored-rule"
                          name="group"
                          label="Use Stored Snort Rules"
                          defaultChecked={false}
                          onChange={handleRadio}
                      />
                      <Form.Check 
                          type="radio"
                          id="new-rule"
                          name="group"
                          label="Input Snort Rules"
                          defaultChecked={false}
                          onChange={handleRadio}
                      />
                      </Form.Group>
                      <hr/>
                      {selection &&
                        <div>
                          {displayInput()}
                        </div>
                      } 
                      <hr/>
                      <div className="mt-3 d-grid gap-2">
                          <Button type="submit">Read PCAP</Button>
                      </div>
                  </Form>
              </div>
          </div>
          <hr/>
          <div className="container w-75 mb-5">
          {results &&
          <div>
            <Terminal
              name="Rule Detections">
                <div className="text-start">
                  <TerminalOutput>{results}</TerminalOutput>
                </div>  
            </Terminal>
            <hr/>
              <div className="d-flex justify-content-center">
              <div className="w-50 mt-3">
              <h5>Save Result to File</h5>
              <Form.Group className="mb-3 text-start" controlId="formLayerDescription">
                  <Form.Label>File Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter file name" onChange={handleInput}/>
              </Form.Group>
                  <div className="text-start mt-3 mb-3">
                      <Button onClick={() => saveResults()}>Save Layer to File</Button>
                  </div>
              </div>
            </div>
        </div>
          }
          </div>
      </Container>
  )
}