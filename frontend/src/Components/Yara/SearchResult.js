import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from'react-bootstrap/Button';
import YaraDataService from '../../services/yara.service';
import Card from 'react-bootstrap/Card';
import { useNavigate, useParams } from 'react-router-dom';
import DynamicPaginator from '../../Custom/DynamicPaginator';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import CommonUtils from '../../lib/utils';

export default function App(){

    const [field, setField] = React.useState();
    const [value, setValue] = React.useState();
    const [yaraRule, setYaraRule] = React.useState(null);
    const [searchedField, setSearchedField] = React.useState();

    const [totalItems, setTotalItems] = React.useState();
    
    const params = useParams();
    const navigate = useNavigate();

    React.useEffect(() => {
        YaraDataService.search(params.field, params.value, params.page, 10).then((response) => {
            setYaraRule(response.data['items']);
            setTotalItems(response.data['total']);
            
            setSearchedField(params.field);
            setField(params.field);
            setValue(params.value);
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
            return CommonUtils.getHighlightedText(singleRule.name, value);
        }
        else if (searchedField === "meta"){
            return CommonUtils.getHighlightedText(singleRule.meta, value);
        }
        else if (searchedField === "strings"){
            return CommonUtils.getHighlightedText(singleRule.strings, value);
        }
        else if (searchedField === "conditions"){
            return CommonUtils.getHighlightedText(singleRule.conditions, value);
        }
        else if (searchedField === "logic hash"){
            return CommonUtils.getHighlightedText(singleRule.logic_hash, value);
        }
        else if (searchedField === "author"){
            return CommonUtils.getHighlightedText(singleRule.author, value);
        }
        else if (searchedField === "date added"){
            return CommonUtils.getHighlightedText(singleRule.date_added, value);
        }
        else if (searchedField === "compiles"){
            return CommonUtils.getHighlightedText(singleRule.compiles, value);
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
        navigate(`/yara/search/${field}/${value}/1`);
    }

    function getNextPage(pageNum) {
        YaraDataService.search(params.field, params.value, pageNum, 10).then((response) => {
            navigate(`/yara/search/${field}/${value}/${pageNum}`);
            setYaraRule(response.data['items']);
            setTotalItems(response.data['total']);

            setSearchedField(params.field);
            setField(params.field);
            setValue(params.value);
        }).catch(function (error) {
            if (error.response)
                {
                    console.log(error.response);
                }
        })
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
                        <Card.Footer className="text-muted">Date Added {CommonUtils.formatTime(rule.date_added)}</Card.Footer>
                    </Card>
                </div>
                )
            })
            )
        }

        if (!yaraRule) return (
            <Spinner className="mt-5" animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        )
    
    if (yaraRule.length === 0){
        return (
            <Container>
                <h4>Search Database Yara Rules</h4>
                <Form onSubmit={handleSubmit}>
                <div className="d-flex justify-content-center mt-3">
                    <div className="input-group w-50">
                        <input required className="form-control" type="text" defaultValue={params.value} onChange={handleInput}></input>
                        <select className="form-select" name="field" defaultValue={searchedField} onChange={handleSelect}>
                            <option>Select Search Term</option>
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
            </Container>
        )
    }
    
    return (
        <Container>
        <h4>Search Database Yara Rules</h4>
        <Form onSubmit={handleSubmit}>
            <div className="d-flex justify-content-center mt-3">
                <div className="input-group w-50">
                    <input required className="form-control" type="text" defaultValue={params.value} onChange={handleInput}></input>
                    <select className="form-select" name="field" defaultValue={searchedField} onChange={handleSelect}>
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
        
        <DynamicPaginator items={yaraRule} Display={DisplayYaraRules} totalItems={totalItems} getNextPage={getNextPage} itemsPerPage={10} pageNum={params.page}/>
        </Container>
    )

}