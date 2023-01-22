import React from 'react';
import SigmaDataService from '../../services/sigma.service';
import { useParams, useNavigate } from 'react-router-dom';

export default function App(){
    const [sigmaRule, setSigmaRule] = React.useState(null);

    const params = useParams();
    const navigate = useNavigate();

    React.useEffect(() => {
        SigmaDataService.rebuild(params.id).then((response) => {
            setSigmaRule(response.data);
        })
    }, []);


    if (!sigmaRule) return <p>Loading...</p>

    return (
            <div>
                <p>Sigma rule rebuilt.</p>
                <textarea rows="30" cols="50">{sigmaRule}</textarea>
            </div>
    )
}