import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import SnortEngineService from '../../../services/snort-engine.service';
import Terminal, { ColorMode, TerminalOutput } from 'react-terminal-ui';
import Spinner from 'react-bootstrap/Spinner';

export default function App(){

    const [file, setFile] = React.useState<any>();
    const [results, setResults] = React.useState<string>("");
    const [summaryCheck, setSummaryCheck] = React.useState<boolean>(false);
    const [rawCheck, setRawCheck] = React.useState<boolean>(false);
    const [inProgress, setInProgress] = React.useState<boolean>(false);
    const [fileName, setFileName] = React.useState<string>("");

    const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
      setFile(event.target.files);
    }
    
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault();
      
      const formData = new FormData();
      formData.append("pcap_file", file[0]);
      setInProgress(true);
      if (summaryCheck === false && rawCheck === false){
        SnortEngineService.readPcap(formData).then((response) => {
          setResults(response.data);
        })
      }
      else if (rawCheck === true && summaryCheck === false){
        SnortEngineService.readPcapDetailed(formData, true).then((response) => {
          setResults(response.data);
        })
      }
      else if (summaryCheck === true && rawCheck === false) {
        SnortEngineService.readPcapDetailed(formData, false).then((response) => {
          setResults(response.data);
        })
      }
            
    }

    const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.name === "summary")
      {
          let summaryValue = summaryCheck;
          if (summaryValue === false){
            setSummaryCheck(true);
          }
          else {
            setSummaryCheck(false);
          }
      }

      if (event.target.name === "raw")
      {
          let rawValue = rawCheck;
          if (rawValue === false){
            setRawCheck(true);
          }
          else {
            setRawCheck(false);
          }
      }
    }

    const handleInput = (event : React.ChangeEvent<HTMLInputElement>) => {
      setFileName(event.target.value);
    }

    function saveResults(){
        const blob = new Blob([results], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `${fileName}.txt`;
        link.href = url;
        link.click();
    }

    if (!results && inProgress === true ) return (
      <Container>
          <div className="d-flex justify-content-center">
              <div className="w-50 mt-3">
                  <h5>Upload PCAP file to have it read by Snort</h5>
                  <Form onSubmit={handleSubmit}>
                      <Form.Group className="mt-3 mb-3 text-start" controlId="formLayerName">
                        <Form.Label>PCAP File</Form.Label>
                        <Form.Control onChange={handleFile} type="file" required/>
                      </Form.Group>

                      <Form.Group className="mt-3 mb-3 text-start" controlId="formRuleSelections">
                      <Form.Check 
                          type="checkbox"
                          id="summary-check"
                          name="summary"
                          label="Show Packet Summary"
                          defaultChecked={false}
                          onChange={handleCheck}
                      />
                      <Form.Check 
                          type="checkbox"
                          id="raw-check"
                          name="raw"
                          label="Show Packet Raw Data"
                          defaultChecked={false}
                          onChange={handleCheck}
                      />
                      </Form.Group>
                      <div className="mt-3 d-grid gap-2">
                          <Button type="submit">Read PCAP</Button>
                      </div>
                  </Form>
              </div>
          </div>
          <hr/>
          <Spinner className="mt-5" animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
    )

    return (
      <Container>
          <div className="d-flex justify-content-center">
              <div className="w-50 mt-3">
                  <h5>Upload PCAP file to have it read by Snort</h5>
                  <Form onSubmit={handleSubmit}>
                      <Form.Group className="mt-3 mb-3 text-start" controlId="formLayerName">
                          <Form.Label>PCAP File</Form.Label>
                          <Form.Control onChange={handleFile} type="file" required/>
                      </Form.Group>

                      <Form.Group className="mt-3 mb-3 text-start" controlId="formRuleSelections">
                      <Form.Check 
                          type="checkbox"
                          id="summary-check"
                          name="summary"
                          label="Show Packet Summary"
                          defaultChecked={false}
                          onChange={handleCheck}
                      />
                      <Form.Check 
                          type="checkbox"
                          id="raw-check"
                          name="raw"
                          label="Show Packet Raw Data"
                          defaultChecked={false}
                          onChange={handleCheck}
                      />
                      </Form.Group>
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
              name="PCAP Result">
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