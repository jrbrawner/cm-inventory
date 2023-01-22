import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from'react-bootstrap/Button';


export default function App(){

    const [field, setField] = React.useState(null);
    const [value, setValue] = React.useState(null);

    const handleInput = event  => {
        setValue(event.target.value);
      }

    const handleSelect = event => {
        setField(event.target.value);
    }

    const handleSubmit = event => {
        event.preventDefault();
        console.log(field);
        console.log(value);
    }

    return (

        <Form onSubmit={handleSubmit}>
            <div className="d-flex justify-content-center mt-3">
                <div className="input-group w-50">
                    <input className="form-control" type="text" onChange={handleInput}></input>
                    <select className="form-select" name="field" onChange={handleSelect}>
                        <option value="name">Name</option>
                        <option value="meta">Meta</option>
                        <option value="strings">Strings</option>
                        <option value="conditions">Conditions</option>
                        <option value="logic_hash">Logic Hash</option>
                        <option value="author">Author</option>
                        <option value="date_added">Date Added</option>
                        <option value="compiles">Compiles</option>
                        <option value="tactics">Tactics</option>
                        <option value="techniques">Techniques</option>
                        <option value="subtechniques">Subtechniques</option>
                    </select>
                    <Button type="submit">Search</Button>
                </div>
            </div>
        </Form>

    )
}