import React from 'react';
import SnortDataService from '../../services/snort.service';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

export default function App(){
    const [snortRule, setSnortRule] = React.useState(null);
    const [rebuiltRule, setRebuiltRule] = React.useState(null);

    const params = useParams();
    const navigate = useNavigate();

    React.useEffect(() => {
        SnortDataService.get(params.field, params.value).then((response) => {
            setSnortRule(response.data);
            console.log(response.data);
        })
    }, []);

    if (!snortRule) return <p>Loading...</p>

    function rebuildRule(id) {
        SnortDataService.test(id).then((response) => {
            setRebuiltRule(response.data);
        })
    }
    

    return (
        <div>

            <div>
                <p>Rules loaded. Result for search.</p>
            {snortRule.map((rule) => {
                return(
                    <div>
                <p>Rule action: {rule.action}</p>
                <p>Rule protocol: {rule.protocol}</p>
                <p>Rule source ip: {rule.src_ip}</p>
                <p>Rule source port: {rule.src_port}</p>
                <p>Rule direction: {rule.direction}</p>
                <p>Rule destination ip: {rule.dst_ip}</p>
                <p>Rule destination port: {rule.dst_port}</p>
                <p>Rule body: {rule.body}</p>
                <p>Rule body options: {rule.body_options}</p>
                </div>
                )
            })}
            </div>
            <div>
                <Button onClick={e => rebuildRule(1)}>Rebuild Rule</Button>
                {rebuiltRule}
            </div>
        </div>
    )
}