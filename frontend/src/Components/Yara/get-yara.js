import React from 'react';
import  YaraDataService from '../../services/yara.service';
import { useParams, useNavigate } from 'react-router-dom';

export default function App(){
    const [yaraRule, setYaraRule] = React.useState(null);

    const params = useParams();
    const navigate = useNavigate();

    React.useEffect(() => {
        YaraDataService.get(params.field, params.value).then((response) => {
            setYaraRule(response.data);
        })
    }, []);


    if (!yaraRule) return <p>Loading...</p>

    return (
            <div>
                <p>Rules loaded. Result for search.</p>
            {yaraRule.map((rule) => {
                return(
                <div>
                <p>Rule name: {rule.name}</p>
                <p>Rule logic hash: {rule.logic_hash}</p>
                </div>
                )
            })}
            </div>
    )
}