import React from 'react';

import Navbar from "react-bootstrap/Navbar" ;
import Nav from "react-bootstrap/Nav";

import logo from './fugazi_logo.png';
import './dash.css';
 
const navigation = props => {
    return (
        <div className="nav-bar">
        <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/dashboard"><a href="/dashboard" className="navbar-brand"><img src={logo} alt-text="Fugazi Logo"></img></a></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto" align-items="center">
            <ul>
            <li id="status" align="right" text-align='right' >Status: {props.loggedInStatus}</li>
            <li><a href="/login">Login</a></li>
            <li><a href="/signup">Register</a></li>
            <li ><a href="/upload">Upload</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
            </ul>
            </Nav>
        </Navbar.Collapse>
        </Navbar>
        </div>

    );
}
 
export default navigation;