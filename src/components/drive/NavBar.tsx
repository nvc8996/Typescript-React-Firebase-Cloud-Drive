import React, { ReactElement } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function NavBarComponent(): ReactElement {
    return (
        <Navbar bg='light' expand='xl'>
            <Navbar.Brand as={Link} to='/' className="ms-3">
                NVC Drive
            </Navbar.Brand>
            <Nav>
                <Nav.Link as={Link} to='/profile' className="me-3">Profile</Nav.Link>
            </Nav>
        </Navbar>
    )
}
