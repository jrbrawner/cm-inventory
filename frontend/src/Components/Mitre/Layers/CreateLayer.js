import React from 'react';
import MitreDataService from '../../../services/mitre.service';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function App(){

    
    React.useEffect(() => {
        
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        MitreDataService.createLayer(formData).then(function (response) {
            alert(response.data);
        }).catch(function (error) {
            alert(error.response['status'] + ": " + error.response['statusText']);
        })
    }
    
    return (
        <Container>

            <div className="d-flex justify-content-center">
                <div className="w-50 mt-3">
                    <h5>Generate a MITRE layer.</h5>
                    <a href="https://github.com/mitre-attack/attack-navigator/tree/master/layers">MITRE Layer Information</a>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3 text-start" controlId="formLayerName">
                                <Form.Label>Layer Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter layer name" name="layer_name" />
                        </Form.Group>

                        <Form.Group className="mb-3 text-start" controlId="formLayerDescription">
                                <Form.Label>Layer Description</Form.Label>
                            <Form.Control type="text" placeholder="Enter layer description" name="layer_description" />
                        </Form.Group>
                        <hr/>
                        <h5>Choose which countermeasures to include in layer generation.</h5>
                        <Form.Group className="mt-3 mb-3 text-start" controlId="formRuleSelections">
                        <Form.Check 
                            type="checkbox"
                            id="yaraCheck"
                            label="Include Yara Rules"
                            defaultChecked="true"
                        />
                        <Form.Check 
                            type="checkbox"
                            id="snortCheck"
                            label="Include Snort Rules"
                            defaultChecked="true"
                        />
                        <Form.Check 
                            type="checkbox"
                            id="sigmaCheck"
                            label="Include Sigma Rules"
                            defaultChecked="true"
                        />
                        </Form.Group>
                        <div className="text-start mt-3">
                            <Button type="submit">Generate Layer</Button>
                        </div>
                    </Form>
                </div>
            </div>
        </Container>
    )
}