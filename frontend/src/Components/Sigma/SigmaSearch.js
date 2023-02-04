import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from'react-bootstrap/Button';
import SigmaDataService from '../../services/sigma.service';
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
        navigate(`/sigma/search/${field}/${value}/1`);
    
    }

    return (
        <Container>
            <h4>Search Database Sigma Rules</h4>
            <Form onSubmit={handleSubmit}>
                <div className="d-flex justify-content-center mt-3">
                    <div className="input-group w-50">
                        <input required className="form-control" type="text" onChange={handleInput}></input>
                        <select className="form-select" name="field" onChange={handleSelect}>
                            <option value="">Select Search Term</option>
                            <option value="author">Author</option>
                            <option value="condition">Condition</option>
                            <option value="description">Description</option>
                            <option value="detection">Detection</option>
                            <option value="logsource">Logsource</option>
                            <option value="raw_text">Raw Text</option>
                            <option value="title">Title</option>
                            <option value="date_added">Date Added</option>
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