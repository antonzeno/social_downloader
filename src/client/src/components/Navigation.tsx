import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { AuthContext } from '../context/AuthContext';
const logo = require('../assets/images/logo.png')


const Navigation = () => {
    const { userLoggedIn, login, logout } = useContext(AuthContext);

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/"><img src={logo} height={30} alt="logo"></img> Social Downloader</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                    </Nav>
                    <Nav className="ml-auto">
                        {!userLoggedIn ?
                            <>
                                <Nav.Link href="/login">Login</Nav.Link>
                                <Nav.Link href="/register">Register</Nav.Link>
                            </> :
                            <Nav.Link href="/" onClick={logout}>Logout</Nav.Link>
                        }

                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigation;
