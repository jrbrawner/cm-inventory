import React from 'react';
import MitreDataService from '../../../services/mitre.service';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import CommonUtils from '../../../lib/utils';

export default function App(){

    const [layerText, setLayerText] = React.useState();
    const [file, setFile] = React.useState();
    const [visualization, setVisualization] = React.useState();
    const [validated, setValidated] = React.useState(true);
    const [results, setResults] = React.useState();
    const [fileName, setFileName] = React.useState();

    const handleInput = event  => {
      setLayerText(event.target.value);
      setValidated(false);
      if (event.target.value === ""){
        setValidated(true);
      }
    }

    const handleFile = event => {
      setFile(event.target.files[0]);
      setValidated(false);
    }

    const handleFileName = (event) => {
        setFileName(event.target.value);
    }
    
    const handleSubmit = (event) => {
      event.preventDefault();
      if (file !== undefined) {
          const formData = new FormData();
          formData.append("file", file);
          MitreDataService.createHeatmap(formData).then(function (response) {
              formatResults(response.data);
            }).catch(function (error) {
                alert(error);
            })
            
        }
        else{
        //rule text wip
        const formData = new FormData();
        formData.append("layer_text", layerText);
        MitreDataService.createHeatmap(formData).then(function (response) {
          formatResults(response.data);
        }).catch(function (error) {
          alert(error);
        })
      }
    }

    function formatResults(result) {
      setResults(result['results']);
      setVisualization(result['visualization']);
    }

    function saveVisualization(){
        const blob = new Blob([visualization], { type: "application/xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `${fileName}.svg`;
        link.href = url;
        link.click();
    }

    

    return (
            <Container className="mb-5">
              <div className="input-group d-flex justify-content-center">
                <h5 className="mt-3">Upload layer file or paste layer text below.</h5>
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
                {results &&
                    <div className="d-flex justify-content-center">
                    <div className="w-50 mt-3">
                    <p>{results}</p>
                    <Form.Group className="mb-3 text-start" controlId="formLayerDescription">
                        <Form.Label>File Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter file name" onChange={handleFileName}/>
                    </Form.Group>
                    <div className="text-start mt-3 mb-3">
                        <Button onClick={() => saveVisualization(visualization)}>Save heatmap to File</Button>  
                    </div>
                    </div>
                </div>
                }
            </Container>
            
    )
}