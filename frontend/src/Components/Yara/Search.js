import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from'react-bootstrap/Button';
import YaraDataService from '../../services/yara.service';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';
import Paginator from '../../Custom/Paginator';

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
        navigate(`/yara/search/${field}/${value}/1`);
    
    }

    return (
        <>
        <h4>Search Database Yara Rules</h4>
        <Form onSubmit={handleSubmit}>
            <div className="d-flex justify-content-center mt-3">
                <div className="input-group w-50">
                    <input required className="form-control" type="text" onChange={handleInput}></input>
                    <select className="form-select" name="field" onChange={handleSelect}>
                        <option value="">Select Search Term</option>
                        <option value="name">Name</option>
                        <option value="meta">Meta</option>
                        <option value="strings">Strings</option>
                        <option value="conditions">Conditions</option>
                        <option value="logic hash">Logic Hash</option>
                        <option value="author">Author</option>
                        <option value="date added">Date Added</option>
                        <option value="compiles">Compiles</option>
                        <option value="tactics">Tactics</option>
                        <option value="techniques">Techniques</option>
                        <option value="subtechniques">Subtechniques</option>
                    </select>
                    <Button type="submit">Search</Button>
                </div>
            </div>
        </Form>
        </>
    )

}