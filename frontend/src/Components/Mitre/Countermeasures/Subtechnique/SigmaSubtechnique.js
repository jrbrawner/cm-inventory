import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import MitreDataService from '../../../../services/mitre.service';
import Container from 'react-bootstrap/Container';
import DynamicPaginator from '../../../../Custom/DynamicPaginator';
import CommonUtils from '../../../../lib/utils';

export default function App() {
    const [rules, setRules] = React.useState();
    const [totalItems, setTotalItems] = React.useState();
    
    const params = useParams();
    const navigate = useNavigate();

    React.useEffect(() => {
        MitreDataService.getSubtechniqueSigma(params.id, params.page, 10).then( function (response) {
            setRules(response.data['items']);
            setTotalItems(response.data['total']);
        }).catch(function (error) {
            if (error.response)
                {
                    console.log(error.response);
                }
        })
    }, []);

    const formatRuleName = (rule) => {
        if (rule.title !== null){
            return rule.title;
        }
        else{
            return 'Rule with no title.'
        }
    } 

    function DisplaySigmaRules (currentItems) {
        if (currentItems.length === 0){
            return (
                <div>
                    <h5>No rules have been added that map to this subtechnique.</h5>
                </div>
            )
        }
        return (
            currentItems.map((rule) => {
                return (
                 <div key={rule.id}>
                 <Card className="text-center mb-2">
                     <Card.Header>{formatRuleName(rule)}</Card.Header>
                     <Card.Body>
                         <Card.Title></Card.Title>
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

    function getNextPage(pageNum) {
        MitreDataService.getTechniqueSigma(params.id, pageNum, 10).then((response) => {
            navigate(`/mitre/countermeasure/sigma/subtechnique/${params.id}/${pageNum}`);
            setRules(response.data['items']);
            setTotalItems(response.data['total']);
        }).catch(function (error) {
            alert(error);
        })
    }


    if (!rules) return <p>Loading...</p>
    
    return (
        <Container>
            <h5>{params.id} Associated Sigma Rules</h5>
            <hr/>
            <DynamicPaginator items={rules} Display={DisplaySigmaRules} totalItems={totalItems} getNextPage={getNextPage} itemsPerPage={10} pageNum={params.page}/>
        </Container>
    )
}