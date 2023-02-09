import React, { SyntheticEvent } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { TextareaAutosize } from '@mui/base';
import Select from 'react-select';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import SnortDataService from '../../services/snort.service';
import ListGroup from 'react-bootstrap/ListGroup';

export default function App(){
    
    interface IOptionKVP {
        id: any,
        option?: string,
        text?: string
    }

    const [ruleText, setRuleText] = React.useState("");
    const [ruleAction, setRuleAction] = React.useState("");
    const [ruleProtocol, setRuleProtocol] = React.useState("");
    const [ruleSourceIP, setRuleSourceIP] = React.useState("");
    const [ruleSourcePort, setRuleSourcePort] = React.useState("");
    const [ruleDirection, setRuleDirection] = React.useState("");
    const [ruleDestinationIP, setRuleDestinationIP] = React.useState("");
    const [ruleDestinationPort, setRuleDestinationPort] = React.useState("");

    const [ruleOptions, setRuleOptions] = React.useState<any[]>([]);
    const [optionKVPList, setOptionKVPList] = React.useState<{[key: string]: IOptionKVP}>({});
    const [optionString, setOptionString] = React.useState("");

    const [testResult, setTestResult] = React.useState<{[key: string]: string}>({});
    
    
    const ruleActionOptions = [
        {value: "alert", label: "alert"},
        {value: "block", label: "block"},
        {value: "drop", label: "drop"},
        {value: "log", label: "log"},
        {value: "pass", label: "pass"}
    ]

    const ruleProtocolOptions = [
        {value: "ip", label: "ip"},
        {value: "icmp", label: "icmp"},
        {value: "tcp", label: "tcp"},
        {value: "udp", label: "udp"}
    ]

    const ruleDirectionOptions = [
        {value: "->", label: "->"},
        {value: "<->", label: "<->"}
    ]

    const options = [
        {value: "msg", label: "msg"},
        {value: "reference", label: "reference"},
        {value: "gid", label: "gid"},
        {value: "sid", label: "sid"},
        {value: "rev", label: "rev"},
        {value: "classtype", label: "classtype"},
        {value: "priority", label: "priority"},
        {value: "metadata", label: "metadata"},
        {value: "service", label: "service"},
        {value: "rem", label: "rem"},
        {value: "file_meta", label: "file_meta"}
    ]

    React.useEffect(() => {
        setRuleText(
            `${ruleAction} ${ruleProtocol} ${ruleSourceIP} ${ruleSourcePort} ${ruleDirection} ${ruleDestinationIP} ${ruleDestinationPort} ${optionString}`
        );
      }, [ruleAction, ruleProtocol, ruleSourceIP, ruleSourcePort, ruleDirection, ruleDestinationIP, ruleDestinationPort, ruleOptions, optionString])

    
    const updateOptionString = () => {
        let optionString = ""
        Object.entries(optionKVPList).map((entry) => {
            if (entry[1].option !== undefined){
                optionString += entry[1].option + ":" 
            }

            if (entry[1].text !== undefined){
                optionString += '"' + entry[1].text + '"' + ";"
            }
        })

        if (optionString !== "") {
            optionString = "(" + optionString + ")";
        }

        setOptionString(optionString);
    }


    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("rule_string", ruleText);

        SnortDataService.testRule(formData).then((response) => {
            setTestResult(response.data);
        })

    }

    const onSelect = (option: any, actionMeta: any) => {
        if (actionMeta.name === "action-select"){
            setRuleAction(option.value);
        }

        if (actionMeta.name === "protocol-select"){
            setRuleProtocol(option.value);
        }

        if (actionMeta.name === "direction-select"){
            setRuleDirection(option.value);
        }
     }

     const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.name === "source-ip"){
            setRuleSourceIP(event.target.value);
        }

        if (event.target.name === "source-port"){
            setRuleSourcePort(event.target.value);
        }

        if (event.target.name === "destination-ip"){
            setRuleDestinationIP(event.target.value);
        }

        if (event.target.name === "destination-port"){
            setRuleDestinationPort(event.target.value);
        }
     }

     const handleRuleTextChange = (event : React.ChangeEvent<HTMLTextAreaElement>) => {
        setRuleText(event.target.value);
     }

     const handleRuleOptionSelect = (option: any, actionMeta: any) => {
        let index = actionMeta.name.replace(/\D/g, '');
        let optionList = optionKVPList;
        
        if (optionList[index] === undefined){
            optionList[index] = {
                id: index,
                option: option.value
            }
        }
        else{
            optionList[index] =  {
                id: index,
                option: option.value,
                text: optionList[index].text
            } 
        }
        setOptionKVPList(optionList);
        updateOptionString();
     }

     const handleRuleOptionInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        let index = event.target.name.replace(/\D/g, '');
        let optionList = optionKVPList;

        if (optionList[index] === undefined){
            optionList[index] = {
                id: index,
                text: event.target.value
            }
        }
        else{
            optionList[index] = {
                id: index,
                option: optionList[index].option,
                text: event.target.value
            } 
        }
        setOptionKVPList(optionList);
        updateOptionString();
     }

     const addRuleOption = (event: React.MouseEvent<HTMLButtonElement>) => {
        let list = ruleOptions;

        let newRuleTextName = `rule-text-${ruleOptions.length + 1}`
        let newRuleOptionName = `rule-option-${ruleOptions.length + 1}`

        list.push(
            <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="2">
                    Option 
                </Form.Label>
                <Col>
                    <Select className="text-start" name={newRuleTextName} options={options} onChange={onSelect}/>
                </Col>
                <Col>
                    <Form.Control name={newRuleOptionName} type="text" placeholder="Enter option text"
                    onChange={handleInput} />
                </Col>
            </Form.Group>
        )

        setRuleOptions(list);

        console.log(newRuleOptionName);
        console.log(newRuleTextName);

     }

    return (
        
            <Container className="mt-3">
                <h4>Create New Snort Rule</h4>
                    <TextareaAutosize
                    className="container mt-3"
                    name="rule-text"
                    defaultValue={ruleText}
                    onChange={handleRuleTextChange}/>
            <Form onSubmit={handleSubmit}>
                <div className="d-flex justify-content-center mt-3">
                    <div className="w-75">
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column>
                                Action
                            </Form.Label>
                            <Col sm="10">
                                <Select className="text-start" name="action-select" options={ruleActionOptions} onChange={onSelect}/>
                            
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column>
                                Protocol
                            </Form.Label>
                            <Col sm="10">
                                <Select className="text-start" name="protocol-select" options={ruleProtocolOptions} onChange={onSelect}/>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column>
                                Source IP
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control name="source-ip" type="text" placeholder="(any, 192.168.0.5, 192.168.1.0/24, $HOME_NET, [192.168.1.0/24,10.1.1.0/24])"
                                onChange={handleInput} autoComplete="off" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column>
                                Source Port 
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control name="source-port" type="text" placeholder="(any, 80, $HTTP_PORTS, 1:1024, [1:1024,5555,$HTTP_PORTS])"
                                onChange={handleInput} autoComplete="off" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column>
                                Direction
                            </Form.Label>
                            <Col sm="10">
                                <Select className="text-start" name="direction-select" options={ruleDirectionOptions} onChange={onSelect}/>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column>
                                Destination IP
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control name="destination-ip" type="text" placeholder="(any, 192.168.0.5, 192.168.1.0/24, $EXTERNAL_NET, [192.168.1.0/24,10.1.1.0/24])"
                                onChange={handleInput} autoComplete="off" />
                            </Col>
                        </Form.Group>
                        
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column>
                                Destination Port 
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control name="destination-port" type="text" placeholder="(any, 80, $HTTP_PORTS, 1:1024, [1:1024,5555,$HTTP_PORTS])"
                                onChange={handleInput} autoComplete="off" />
                            </Col>
                        </Form.Group>
                        <hr/>
                        <h5 className="mt-3 mb-3">Add Rule Options</h5>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="2">
                                Option 
                            </Form.Label>
                            <Col>
                                <Select className="text-start" name="rule-text-0" options={options} onChange={handleRuleOptionSelect}/>
                            </Col>
                            <Col>
                                <Form.Control name="rule-option-0" type="text" placeholder="Enter option text"
                                onChange={handleRuleOptionInput} autoComplete="off" />
                            </Col>
                        </Form.Group>

                        {ruleOptions && 
                            ruleOptions.map((ruleOption) => {
                                return (
                                    <div>
                                        {ruleOption}
                                    </div>
                                )
                            })
                        }

                        <Form.Group as={Row} className="mb-3">
                            <Col>
                                <Button onClick={addRuleOption} id="rule-option-0" 
                                className="shadow-none mt-2" variant=""><span><FontAwesomeIcon icon={faPlus} /></span></Button>
                            </Col>
                        </Form.Group>

                    </div>
                </div>
                <Button type="submit">Test Rule</Button>
            </Form>
            {testResult &&
                <ListGroup className="mt-2">
                    <ListGroup.Item variant={testResult.variant}>{testResult.msg}</ListGroup.Item>
                </ListGroup>
            }
            
            </Container>
        
    )
}