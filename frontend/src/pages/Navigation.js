import React from 'react';

import Navbar from "react-bootstrap/Navbar" ;
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container"

import logo from './fugazi_logo.png';
import './dash.css';
 
const Navigation = props => {
    return (
       <Container>
        <div className="nav-bar">
        <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home"><a href="/" class="navbar-brand"><img src={logo} alt-text="Fugazi Logo"></img></a></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
            <ul>
            <li><a href="/login">Login</a></li>
            <li><a href="/signup">Register</a></li>
            <li ><a href="/upload">Upload</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
            </ul>
            <ul align="right" text-align='right' >Status: {props.loggedInStatus}</ul>
            </Nav>
        </Navbar.Collapse>
        </Navbar>

        </div>
        
      </Container>

    );
}
 
export default Navigation;