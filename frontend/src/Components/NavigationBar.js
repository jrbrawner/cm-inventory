import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export default function NavigationBar(){
    return (
        <Navbar bg="light" expand="sm">
          <Container>
            <Nav className="me-auto">
                <Nav.Link href="/countermeasures">Countermeasures</Nav.Link>
                <Nav.Link href="/mitre">Mitre</Nav.Link>
            </Nav>
          </Container>
        </Navbar>

    )
    
    
  

}