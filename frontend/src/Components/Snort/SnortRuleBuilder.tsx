import React, { SyntheticEvent } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { OnChangeValue } from 'react-select';
import { TextareaAutosize } from '@mui/base';
import Select from 'react-select';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import FloatingLabel from 'react-bootstrap/FloatingLabel';


export default function App(){

    const navigate = useNavigate();

    const [ruleText, setRuleText] = React.useState("");
    const [ruleAction, setRuleAction] = React.useState("");
    const [ruleProtocol, setRuleProtocol] = React.useState("");
    const [ruleSourceIP, setRuleSourceIP] = React.useState("");
    const [ruleSourcePort, setRuleSourcePort] = React.useState("");
    const [ruleDirection, setRuleDirection] = React.useState("");
    const [ruleDestinationIP, setRuleDestinationIP] = React.useState("");
    const [ruleDestinationPort, setRuleDestinationPort] = React.useState("");

    const [ruleOptions, setRuleOptions] = React.useState([""]);
    

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

    React.useEffect(() => {
        setRuleText(
            `${ruleAction} ${ruleProtocol} ${ruleSourceIP} ${ruleDirection} ${ruleDestinationIP} ${ruleDestinationPort}`
        );
      }, [ruleAction, ruleProtocol, ruleSourceIP, ruleDirection, ruleDestinationIP, ruleDestinationPort])


    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();
    
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

     const addRuleOption = (event: React.MouseEvent<HTMLButtonElement>) => {
        let list = []

        list.push(event.currentTarget.id);
        setRuleOptions(list);

        let newRuleOptionName = `rule-option-${ruleOptions.length + 1}`
        console.log(newRuleOptionName);
        return (
            <Form.Group as={Row} className="mb-3">
                <Col>
                    <Button onClick={addRuleOption} id={newRuleOptionName} 
                    className="shadow-none mt-2" variant=""><span><FontAwesomeIcon icon={faPlus} /></span></Button>
                </Col>
            </Form.Group>
        )

     }

    return (
        
            <Container className="mt-3">
                <h4>Create New Snort Rule</h4>
                    <TextareaAutosize
                    className="container mt-3"
                    defaultValue={ruleText}/>
            <Form>
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
                                onChange={handleInput} />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column>
                                Source Port 
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control name="source-port" type="text" placeholder="(any, 80, $HTTP_PORTS, 1:1024, [1:1024,5555,$HTTP_PORTS])"
                                onChange={handleInput} />
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
                                onChange={handleInput} />
                            </Col>
                        </Form.Group>
                        
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column>
                                Destination Port 
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control name="destination-port" type="text" placeholder="(any, 80, $HTTP_PORTS, 1:1024, [1:1024,5555,$HTTP_PORTS])"
                                onChange={handleInput} />
                            </Col>
                        </Form.Group>
                        <hr/>
                        <h5>Add Rule Options</h5>
                        
                        <Form.Group as={Row} className="mb-3">
                            <Col>
                                <Button onClick={addRuleOption} id="rule-option-1" 
                                className="shadow-none mt-2" variant=""><span><FontAwesomeIcon icon={faPlus} /></span></Button>
                            </Col>
                        </Form.Group>

                    </div>
                </div>
            </Form>
    
            </Container>
        
    )
}