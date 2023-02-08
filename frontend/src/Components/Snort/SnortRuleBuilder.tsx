import React from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { OnChangeValue } from 'react-select';
import { TextareaAutosize } from '@mui/base';
import Select from 'react-select';

export default function App(){

    const navigate = useNavigate();

    const [ruleText, setRuleText] = React.useState("");
    const [ruleAction, setRuleAction] = React.useState("");

    const ruleActions = [
        "alert",
        "block",
        "drop",
        "log",
        "pass"
    ]

    const ruleActionOptions = [
        {value: "alert", label: "alert"},
        {value: "block", label: "block"},
        {value: "drop", label: "drop"},
        {value: "log", label: "log"},
        {value: "pass", label: "pass"}
    ]

    React.useEffect(() => {
        setRuleText(
            ruleAction
        );
      }, [ruleAction])

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>)  => {
        
      }

    const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRuleAction(event.target.value);
    }

    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();
    
    }

    const onSelect = (option: any) => {
        setRuleAction(option.value);
     }

    return (
        
            <Container>
                <h4>Create New Snort Rule</h4>
                    <TextareaAutosize
                    className="container"
                    defaultValue={ruleText}/>
                    <div className="d-flex justify-content-center mt-3">
                        <div className="w-50">
                            <h6>Rule Action</h6>              
                            <Select options={ruleActionOptions} onChange={onSelect}/>
                        </div>
                    </div>
                
            </Container>
        
    )
}