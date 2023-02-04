import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from'react-bootstrap/Button';
import SigmaDataService from '../../services/sigma.service';
import Card from 'react-bootstrap/Card';
import { useNavigate, useParams } from 'react-router-dom';
import DynamicPaginator from '../../Custom/DynamicPaginator';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import CommonUtils from '../../lib/utils';

export default function App(){

    const [field, setField] = React.useState();
    const [value, setValue] = React.useState();
    const [sigmaRule, setSigmaRule] = React.useState(null);
    const [searchedField, setSearchedField] = React.useState();

    const [totalItems, setTotalItems] = React.useState();
    
    const params = useParams();
    const navigate = useNavigate();

    React.useEffect(() => {
        SigmaDataService.search(params.field, params.value, params.page, 10).then((response) => {
            setSigmaRule(response.data['items']);
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
        if (searchedField === "author"){
            return CommonUtils.getHighlightedText(singleRule.author, value);
        }
        else if (searchedField === "condition"){
            return CommonUtils.getHighlightedText(singleRule.condition, value);
        }
        else if (searchedField === "description"){
            return CommonUtils.getHighlightedText(singleRule.description, value);
        }
        else if (searchedField === "detection"){
            return CommonUtils.getHighlightedText(singleRule.detection, value);
        }
        else if (searchedField === "logsource"){
            return CommonUtils.getHighlightedText(singleRule.logsource, value);
        }
        else if (searchedField === "raw_text"){
            return CommonUtils.getHighlightedText(singleRule.raw_text, value);
        }
        else if (searchedField === "title"){
            return CommonUtils.getHighlightedText(singleRule.title, value);
        }
        else if (searchedField === "date_added"){
            return CommonUtils.getHighlightedText(singleRule.date_added, value);
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

    const getRuleTitle = (rule) => {
        let name = rule.title;

        if (name === null){
            name = "No title in rule."
        }
        return name;
    }

    const handleSubmit = () => {
        navigate(`/sigma/search/${field}/${value}/1`);
    }

    function getNextPage(pageNum) {
        SigmaDataService.search(params.field, params.value, pageNum, 10).then((response) => {
            navigate(`/sigma/search/${field}/${value}/${pageNum}`);
            setSigmaRule(response.data['items']);
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

    function DisplaySigmaRules (currentItems) {
           return (
               currentItems.map((rule) => {
                   return (
                    <div key={rule.id}>
                    <Card className="text-center mb-2">
                        <Card.Header>{getRuleTitle(rule)}</Card.Header>
                        <Card.Body>
                            <Card.Title>{highlight(rule)}</Card.Title>
                            <Card.Text>
                               
                            </Card.Text>
                            <Button variant="outline-primary" onClick={() => navigate(`/sigma/${rule.id}`)}>Expand Rule</Button>
                        </Card.Body>
                        <Card.Footer className="text-muted">Date Added {CommonUtils.formatTime(rule.date_added)}</Card.Footer>
                    </Card>
                </div>
                )
            })
            )
        }

        if (!sigmaRule) return (
            <Spinner className="mt-5" animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        )
    
    if (sigmaRule.length === 0){
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
            <hr/>
            <h4>No Sigma rules found with that search term for that field.</h4>
        </Container>
        )
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
            <hr/>
            
        <DynamicPaginator items={sigmaRule} Display={DisplaySigmaRules} totalItems={totalItems} getNextPage={getNextPage} itemsPerPage={10} pageNum={params.page}/>
        </Container>
    )

}