import React, {Component} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
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
                        <Link className="link-text" to='/'>
                            <img
                                src={logo}
                                width="45"
                                height="30"
                                alt="ADL Initiative Logo"
                            />
                        </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link>
                                <Link className="link-text text-color-nav" to="/">
                                    Home
                                </Link>
                            </Nav.Link>
                            <Nav.Link>
                                <Link className="link-text text-color-nav" to="/visualizer">
                                    Visualizer
                                </Link>
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        )
    }
}