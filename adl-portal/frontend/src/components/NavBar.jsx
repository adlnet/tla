import React, {Component} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import logo from '../images/adl-logo.png';

/*
    Navigational bar for the entire website
*/

export default class NavBar extends Component {
    render(){
        return (
            <div>
                <Navbar className="bg-color-nav py-3" variant="light" position="top" sticky="top">
                    <Navbar.Brand>
                        <a className="link-text" target="_blank" rel="noreferrer" href='https://adlnet.gov'>
                            <img
                                src={logo}
                                width="45"
                                height="30"
                                alt="ADL Initiative Logo"
                            />
                        </a>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link className="link-text text-color-nav" to="/">
                                Home
                            </Nav.Link>
                            {/* <Nav.Link>
                                <Link className="link-text text-color-nav" to="/visualizer">
                                    Visualizer
                                </Link>
                            </Nav.Link> */}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        )
    }
}