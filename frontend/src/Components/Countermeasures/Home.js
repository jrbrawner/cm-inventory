import React from 'react';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';


export default function App() {
    return (
        <div>
            <CardGroup>
                <div>
                <Card border="primary">
                    <Card.Body>
                        <Card.Title>Yara</Card.Title>
                        <Card.Text>
                            Create and manage Yara rules.
                        </Card.Text>
                    </Card.Body>
                </Card>
                </div>
                <Card border="primary">
                    <Card.Body>
                        <Card.Title>Snort</Card.Title>
                        <Card.Text>
                            Create and manage Snort rules.
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Card border="primary">
                    <Card.Body>
                        <Card.Title>Sigma</Card.Title>
                        <Card.Text>
                            Create and manage Sigma rules.
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Card border="primary" style={{ width: '18rem' }}>
        <Card.Header>Header</Card.Header>
        <Card.Body>
          <Card.Title>Primary Card Title</Card.Title>
          <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </Card.Text>
        </Card.Body>
      </Card>
      <br />
            </CardGroup>
            
        </div>
    )
}