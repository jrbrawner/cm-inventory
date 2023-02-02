import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from'react-bootstrap/Button';
import SnortDataService from '../../services/snort.service';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';
import Paginator from '../../Custom/Paginator';
import Container from 'react-bootstrap/Container';

export default function App(){

    const [field, setField] = React.useState();
    const [value, setValue] = React.useState();

    const navigate = useNavigate();

    const handleInput = event  => {
        setValue(event.target.value);
      }

    const handleSelect = event => {
        setField(event.target.value);
    }

    const handleSubmit = event => {
        event.preventDefault();
        navigate(`/snort/search/${field}/${value}/1`);
    
    }

    return (
        <Container>
            <h4>Search Database Snort Rules</h4>
            <Form onSubmit={handleSubmit}>
                <div className="d-flex justify-content-center mt-3">
                    <div className="input-group w-50">
                        <input required className="form-control" type="text" onChange={handleInput}></input>
                        <select className="form-select" name="field" onChange={handleSelect}>
                            <option value="">Select Search Term</option>
                            <option value="action">Action</option>
                            <option value="protocol">Protocol</option>
                            <option value="src_ip">Source IP</option>
                            <option value="src_port">Source Port</option>
                            <option value="direction">Direction</option>
                            <option value="dst_ip">Destination IP</option>
                            <option value="dst_port">Destination Port</option>
                            <option value="date_added">Date Added</option>
                            <option value="body_options">Body Options</option>
                            <option value="tactics">Tactics</option>
                            <option value="techniques">Techniques</option>
                            <option value="subtechniques">Subtechniques</option>
                        </select>
                        <Button type="submit">Search</Button>
                    </div>
                </div>
            </Form>
        </Container>
    )

}