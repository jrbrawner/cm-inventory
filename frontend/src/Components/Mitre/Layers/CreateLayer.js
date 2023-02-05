import React from 'react';
import MitreDataService from '../../../services/mitre.service';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';

export default function App(){

    const [ruleOptions, setRuleOptions] = React.useState();
    const [layerOptions, setLayerOptions] = React.useState();

    React.useEffect(() => {
        MitreDataService.getLayerOptions().then( function (response) {
        setRuleOptions(response.data['rule_options']);
        setLayerOptions(response.data['layer_options'])
        }).catch(function (error) {
            if (error.response)
                {
                    console.log(error.response);
                }
        })
    }, []);

    if (!ruleOptions) return (
        <Spinner className="mt-5" animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    )


    return (
        <Container>
            
        </Container>
    )
}