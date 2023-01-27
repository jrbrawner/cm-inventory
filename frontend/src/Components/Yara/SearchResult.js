import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from'react-bootstrap/Button';
import YaraDataService from '../../services/yara.service';
import Card from 'react-bootstrap/Card';
import { useNavigate, useParams } from 'react-router-dom';
import Paginator from '../../Custom/Paginator';
import Select from 'react-select';

export default function App(){

    const [field, setField] = React.useState();
    const [value, setValue] = React.useState(null);
    const [yaraRule, setYaraRule] = React.useState(null);
    const [searchedField, setSearchedField] = React.useState();
    const params = useParams();
    const navigate = useNavigate();

    React.useEffect(() => {
        YaraDataService.search(params.field, params.value, 0, 10).then((response) => {
            setYaraRule(response.data);
            setSearchedField(params.field);
        }).catch(function (error) {
            if (error.response)
                {
                    console.log(error.response);
                }
        })
    }, []);


    const handleInput = event  => {
        setValue(event.target.value);
      }

    const handleSelect = event => {
        setField(event.target.value);
    }

    function highlight(singleRule){
        if (searchedField === "name"){
            return singleRule.name;
        }
        else if (searchedField === "meta"){
            return singleRule.meta;
        }
        else if (searchedField === "strings"){
            return singleRule.strings;
        }
        else if (searchedField === "conditions"){
            return singleRule.conditions;
        }
        else if (searchedField === "logic hash"){
            return singleRule.logic_hash;
        }
        else if (searchedField === "author"){
            return singleRule.author;
        }
        else if (searchedField === "date added"){
            return singleRule.date_added;
        }
        else if (searchedField === "compiles"){
            return singleRule.compiles;
        }
        else if (searchedField === "tactics"){
            return singleRule.tactics.map((tactic) => {
                return (
                    <p key={tactic.id}>{tactic.id} | {tactic.name}</p>
                )
            });
        }
        else if (searchedField === "techniques"){
            return singleRule.techniques.map((technique) => {
                return (
                    <p key={technique.id}>{technique.name}</p>
                )
            });
        }
        else if (searchedField === "subtechniques"){
            return singleRule.subtechniques;
        }
    }

    const handleSubmit = event => {
        navigate(`/yara/search/${field}/${value}`);
        console.log(field);
        console.log(value);
    
    }

    function DisplayYaraRules (currentItems) {
           return (
               currentItems.map((rule) => {
                   return (
                    <div key={rule.id}>
                    <Card className="text-center mb-2">
                        <Card.Header>Rule Name: {rule.name}</Card.Header>
                        <Card.Body>
                            <Card.Title>{highlight(rule)}</Card.Title>
                            <Card.Text>
                               
                            </Card.Text>
                            <Button variant="outline-primary" onClick={() => navigate(`/yara/${rule.id}`)}>Expand Rule</Button>
                        </Card.Body>
                        <Card.Footer className="text-muted">Date Added {rule.date_added}</Card.Footer>
                    </Card>
                </div>
                )
            })
            )
        }

        const options = [
            { value: 'name', label: 'Name' },
            { value: 'meta', label: 'Meta' },
            { value: 'strings', label: 'Strings' }
          ]

    if (!yaraRule) return (
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
    
    if (yaraRule.length === 0){
        return (
            <>
                <h4>Search Database Yara Rules</h4>
                <Form onSubmit={handleSubmit}>
                <div className="d-flex justify-content-center mt-3">
                    <div className="input-group w-50">
                        <input required className="form-control" type="text" defaultValue={params.value} onChange={handleInput}></input>
                        <select className="form-select" name="field" defaultChecked={params.field} onChange={handleSelect}>
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
            <hr/>
            <h4>No rules found with that search term for that field.</h4>
            </>
        )
    }
    
    return (
        <>
        <h4>Search Database Yara Rules</h4>
        <Form onSubmit={handleSubmit}>
            <div className="d-flex justify-content-center mt-3">
                <div className="input-group w-50">
                    <input required className="form-control" type="text" defaultValue={params.value} onChange={handleInput}></input>
                    <Select
                    onChange={handleSelect}
                    options={options}/>
                    <Button type="submit">Search</Button>
                </div>
            </div>
        </Form>
        <hr/>
        <Paginator itemsPerPage={10} items={yaraRule} Display={DisplayYaraRules} />
        </>
    )

}