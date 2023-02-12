import React from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { TextareaAutosize } from '@mui/base';
import Select from 'react-select';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import SnortDataService from '../../services/snort.service';
import ListGroup from 'react-bootstrap/ListGroup';
import Stack from 'react-bootstrap/Stack';

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
    const [optionsAdded, setOptionsAdded] = React.useState(0);

    const [testResult, setTestResult] = React.useState<{[key: string]: string}>({});

    const selectActionRef = React.useRef<any>();
    const selectProtocolRef = React.useRef<any>();
    const selectDirectionRef = React.useRef<any>();
    
    
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

      }, [ruleAction, ruleProtocol, ruleSourceIP, ruleSourcePort, ruleDirection, ruleDestinationIP, ruleDestinationPort, optionString])

    React.useEffect(() => {
        updateOptionString();
    }, [optionsAdded, optionKVPList])

    const updateOptionString = () => {
        let optionString = ""
        for (let [key, value] of Object.entries<IOptionKVP>(optionKVPList)) {
            if (value.option !== undefined){    
                optionString += value.option + ":" 
            }

            if (value.text !== undefined){
                optionString += value.text + "; "
            }

        }
    
        if (optionString !== "") {
            optionString = "(" + optionString + ")";
        }
        setOptionString(optionString);
        setOptionsAdded(optionsAdded + 1);
    }

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("rule_string", ruleText);

        SnortDataService.testRule(formData).then((response) => {
            setTestResult(response.data);
        }).catch((error) => {
            alert(error['name'] + error['message']);
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
        console.log(optionList[index]);
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
        //updateOptionString();
     }

     const handleRuleOptionInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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
        //updateOptionString();
     }

     const addRuleOption = (event: React.MouseEvent<HTMLButtonElement>) => {
        let list = ruleOptions;
        let index = ruleOptions.length + 1;
        let newRuleTextName = `rule-text-${index}`
        let newRuleOptionName = `rule-option-${index}`

        list.push(
            {
                id : index,
                result: 
                    <Form.Group key={index} as={Row} className="mb-3">
                        <Form.Label id={`label-${index}`} column sm="2">
                            Option 
                        </Form.Label>
                        <Col>
                            <Select className="text-start" id={newRuleOptionName} name={newRuleOptionName}
                             options={options} onChange={handleRuleOptionSelect}/>
                        </Col>
                        <Col>
                            <TextareaAutosize style={{ minHeight: 1}}className="container form-control" id={newRuleTextName}
                             name={newRuleTextName} placeholder="Enter option text"
                             onChange={handleRuleOptionInput}/>
                        </Col>
                        <Col sm={1}>
                            <Button onClick={deleteRow}  name={`row-${index}-delete`} id={`row-${index}-delete`}
                                className="shadow-none" variant=""><span><FontAwesomeIcon icon={faCircleXmark} /></span></Button>
                        </Col>
                    </Form.Group>
            }
        )

        setRuleOptions(list);
        setOptionsAdded(optionsAdded + 1);
     }

     const addRuleOptionManual = (optionsKVP : {[key : number] : IOptionKVP}) => {
        
        let list = [];
        
        for (let [key, value] of Object.entries<IOptionKVP>(optionsKVP)) {
            let newRuleTextName = `rule-text-${key}`
            let newRuleOptionName = `rule-option-${key}`
            list.push(
                {
                    id : key,
                    result: 
                        <Form.Group key={key} as={Row} className="mb-3">
                            <Form.Label id={`label-${key}`} column sm="2">
                                Option 
                            </Form.Label>
                            <Col>
                                <Select className="text-start" defaultValue={{value: `${value.option}`, label: `${value.option}`}} id={newRuleOptionName} name={newRuleOptionName}
                                options={options} onChange={handleRuleOptionSelect}/>
                            </Col>
                            <Col>
                                <TextareaAutosize style={{ minHeight: 1}} className="container form-control" id={newRuleTextName} name={newRuleTextName} placeholder="Enter option text"
                                onChange={handleRuleOptionInput} defaultValue={value.text}/>
                            </Col>
                            <Col sm={1}>
                                <Button onClick={deleteRow} name={`row-${key}-delete`} id={`row-${key}-delete`} 
                                className="shadow-none" variant=""><span><FontAwesomeIcon icon={faCircleXmark} /></span></Button>
                            </Col>
                        </Form.Group>
                }
            )
            setOptionsAdded(optionsAdded + 1);
        }
        
        setRuleOptions(list);
     }

     const deconstructRule = (event: React.MouseEvent<HTMLButtonElement>) => {
        
        if (ruleText !== "       ")
        {
            const formData = new FormData()
            formData.append("rule_string", ruleText);
            clearOptionState();
            SnortDataService.deconstructRule(formData).then((response) => {
                let data = response.data['rule'];
                
                for (let i = 0; i < ruleOptions.length; i++)
                {
                    deleteRowManual(i + 1);
                }

            selectActionRef.current.setValue({value: data['action'], label: data['action']});
            selectProtocolRef.current.setValue({value: data['protocol'], label: data['protocol']})
            setRuleSourceIP(data['source_ip']);
            setRuleSourcePort(data['source_port']);
            selectDirectionRef.current.setValue({value: data['direction'], label: data['direction']});
            setRuleDestinationIP(data['dest_ip']);
            setRuleDestinationPort(data['dest_port']);
            const returnedOptions = JSON.parse(data['body_options']);
            
            var optionsKVP : {[key: number]: IOptionKVP} = {}
            
            var index = 0;
            
            for (let [key, value] of Object.entries<string>(returnedOptions)) {
                for (let [option, text] of Object.entries<string>(value)) {
                    
                    optionsKVP[index] = {
                        id: index,
                        option: option,
                        text: text
                    }
                    index += 1;
                }
            }
            
            setOptionKVPList(optionsKVP);
            addRuleOptionManual(optionsKVP);
            
            })}
            
        }

     const deleteRow = (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log(optionKVPList);
        let index = event.currentTarget.name.replace(/\D/g, '');
        var button = document.getElementById(event.currentTarget.name);
        var optionSelect = document.getElementById(`rule-option-${index}`);
        var optionText = document.getElementById(`rule-text-${index}`);
        var label = document.getElementById(`label-${index}`);
        if (button !== null){
            button.remove();
        }

        if (optionSelect !== null){
            optionSelect.remove();
        }

        if (optionText !== null){
            optionText.remove()
        }

        if (label !== null){
            label.remove();
        }

        let optionList = optionKVPList;
        optionList[index] = {
            id: undefined,
            option: undefined,
            text: undefined
        }
        setOptionKVPList(optionList);

        
     }

     const clearOptionState = () => {
        setOptionString("");
        setRuleOptions([[]]);
        setOptionKVPList({});
        setOptionsAdded(0);
     }

     const deleteRowManual = (index: number) => {
        
        var button = document.getElementById(`row-${index}-delete`);
        var optionSelect = document.getElementById(`rule-option-${index}`);
        var optionText = document.getElementById(`rule-text-${index}`);
        var label = document.getElementById(`label-${index}`);

        if (button !== null){
            button.remove();
        }

        if (optionSelect !== null){
            optionSelect.remove();
        }

        if (optionText !== null){
            optionText.remove()
        }

        if (label !== null){
            label.remove();
        }
        
     }

    return (
        
            <Container className="mt-3">
                <div className="">
                    <Row>
                        <Col lg={{ span: 6, offset: 3 }}>
                            <h4>Snort Rule Builder</h4>
                        </Col>
                        <Col>
                            <Button variant="outline-secondary" onClick={deconstructRule}>Deconstruct Rule</Button>
                        </Col>
                    </Row>
                    
                </div>
                    <TextareaAutosize
                    minRows={5}
                    className="container mt-3 w-75"
                    value={ruleText}
                    onChange={handleRuleTextChange}/>

            <Form onSubmit={handleSubmit}>
                <div className="d-flex justify-content-center mt-3">
                    <div className="w-75">

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column>
                                Action
                            </Form.Label>
                            <Col sm="10">
                                <Select ref={selectActionRef} className="text-start" name="action-select" options={ruleActionOptions} onChange={onSelect}/>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column>
                                Protocol
                            </Form.Label>
                            <Col sm="10">
                                <Select ref={selectProtocolRef} className="text-start" name="protocol-select" options={ruleProtocolOptions} onChange={onSelect}/>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column>
                                Source IP
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control defaultValue={ruleSourceIP} name="source-ip" id="source-ip" type="text" placeholder="(any, 192.168.0.5, 192.168.1.0/24, $HOME_NET, [192.168.1.0/24,10.1.1.0/24])"
                                onChange={handleInput} autoComplete="off" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column>
                                Source Port 
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control defaultValue={ruleSourcePort} name="source-port" type="text" placeholder="(any, 80, $HTTP_PORTS, 1:1024, [1:1024,5555,$HTTP_PORTS])"
                                onChange={handleInput} autoComplete="off" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column>
                                Direction
                            </Form.Label>
                            <Col sm="10">
                                <Select ref={selectDirectionRef} className="text-start" name="direction-select" options={ruleDirectionOptions} onChange={onSelect}/>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column>
                                Destination IP
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control defaultValue={ruleDestinationIP} name="destination-ip" type="text" placeholder="(any, 192.168.0.5, 192.168.1.0/24, $EXTERNAL_NET, [192.168.1.0/24,10.1.1.0/24])"
                                onChange={handleInput} autoComplete="off" />
                            </Col>
                        </Form.Group>
                        
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column>
                                Destination Port 
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control defaultValue={ruleDestinationPort} name="destination-port" type="text" placeholder="(any, 80, $HTTP_PORTS, 1:1024, [1:1024,5555,$HTTP_PORTS])"
                                onChange={handleInput} autoComplete="off" />
                            </Col>
                        </Form.Group>

                            <hr/>
                            <h5 className="mt-3 mb-3">Add Rule Options</h5>
                            </div>
                        </div>
                    <div className="d-flex justify-content-center mt-3">
                        <div className="w-75">

                    <Stack>
                        {ruleOptions && 
                            
                            ruleOptions.map((ruleOption) => {
                                return (
                                        <div key={ruleOption.id}>{ruleOption.result}</div>
                                    )
                                
                                })
                            }
                    </Stack>

                        <Form.Group as={Row} className="mb-3">
                            <Col>
                                <Button onClick={addRuleOption}  
                                className="shadow-none mt-2" variant=""><span><FontAwesomeIcon icon={faPlus} /></span></Button>
                            </Col>
                        </Form.Group>
                    </div>
                </div>
                <Button type="submit">Test Rule</Button>
            </Form>
            <hr/>
            {testResult &&
            <div>
                <ListGroup className="mt-3 mb-5">
                    <ListGroup.Item variant={testResult.variant}>{testResult.msg}</ListGroup.Item>
                </ListGroup>
            </div>
            }

            
            </Container>
        
    )
}