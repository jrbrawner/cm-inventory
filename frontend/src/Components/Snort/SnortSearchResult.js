import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from'react-bootstrap/Button';
import SnortDataService from '../../services/snort.service';
import Card from 'react-bootstrap/Card';
import { useNavigate, useParams } from 'react-router-dom';
import DynamicPaginator from '../../Custom/DynamicPaginator';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import CommonUtils from '../../lib/utils';

export default function App(){

    const [field, setField] = React.useState();
    const [value, setValue] = React.useState();
    const [snortRule, setSnortRule] = React.useState(null);
    const [searchedField, setSearchedField] = React.useState();

    const [totalItems, setTotalItems] = React.useState();
    
    const params = useParams();
    const navigate = useNavigate();

    React.useEffect(() => {
        SnortDataService.search(params.field, params.value, params.page, 10).then((response) => {
            setSnortRule(response.data['items']);
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
        if (searchedField === "action"){
            return CommonUtils.getHighlightedText(singleRule.action, value);
        }
        else if (searchedField === "protocol"){
            return CommonUtils.getHighlightedText(singleRule.protocol, value);
        }
        else if (searchedField === "src_ip"){
            return CommonUtils.getHighlightedText(singleRule.src_ip, value);
        }
        else if (searchedField === "src_port"){
            return CommonUtils.getHighlightedText(singleRule.src_port, value);
        }
        else if (searchedField === "direction"){
            return CommonUtils.getHighlightedText(singleRule.direction, value);
        }
        else if (searchedField === "dst_ip"){
            return CommonUtils.getHighlightedText(singleRule.dst_ip, value);
        }
        else if (searchedField === "dst_port"){
            return CommonUtils.getHighlightedText(singleRule.dst_port, value);
        }
        else if (searchedField === "date_added"){
            return CommonUtils.getHighlightedText(singleRule.date_added, value);
        }
        else if (searchedField === "body_options"){
            return CommonUtils.getHighlightedText(singleRule.body_options, value);
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

    const getRuleMsg = (rule) => {
        let name = rule.msg;

        if (name === null){
            name = "No msg option in rule."
        }
        return name;
    }

    const handleSubmit = () => {
        navigate(`/snort/search/${field}/${value}/1`);
    }

    function getNextPage(pageNum) {
        SnortDataService.search(params.field, params.value, pageNum, 10).then((response) => {
            navigate(`/snort/search/${field}/${value}/${pageNum}`);
            setSnortRule(response.data['items']);
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

    function DisplaySnortRules (currentItems) {
           return (
               currentItems.map((rule) => {
                   return (
                    <div key={rule.id}>
                    <Card className="text-center mb-2">
                        <Card.Header>{getRuleMsg(rule)}</Card.Header>
                        <Card.Body>
                            <Card.Title>{highlight(rule)}</Card.Title>
                            <Card.Text>
                               
                            </Card.Text>
                            <Button variant="outline-primary" onClick={() => navigate(`/snort/${rule.id}`)}>Expand Rule</Button>
                        </Card.Body>
                        <Card.Footer className="text-muted">Date Added {CommonUtils.formatTime(rule.date_added)}</Card.Footer>
                    </Card>
                </div>
                )
            })
            )
        }

        if (!snortRule) return (
            <Spinner className="mt-5" animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        )
    
    if (snortRule.length === 0){
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
            <hr/>
            <h4>No Snort rules found with that search term for that field.</h4>
        </Container>
        )
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
            <hr/>
            
        <DynamicPaginator items={snortRule} Display={DisplaySnortRules} totalItems={totalItems} getNextPage={getNextPage} itemsPerPage={10} pageNum={params.page}/>
        </Container>
    )

}