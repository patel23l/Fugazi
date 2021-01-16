import React from 'react';
import Navbar from "react-bootstrap/Navbar" ;
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

import { NavLink } from 'react-router-dom';
import logo from './fugazi_logo.png';

const Navigation = () => {
    return (
       <div class="container">
        <Navbar bg="light" expand="lg">
  <Navbar.Brand href="#home"><a href="/" class="navbar-brand"><img src={logo} alt-text="Fugazi Logo"></img></a></Navbar.Brand>
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="mr-auto">
      <Nav.Link href="/">Login</Nav.Link>
      <Nav.Link href="/dashboard">Dashboard</Nav.Link>
      <Nav.Link href="/upload">Upload</Nav.Link>
      <NavDropdown title="Dropdown" id="basic-nav-dropdown">
        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
      </NavDropdown>
    </Nav>
    <Form inline>
      <FormControl type="text" placeholder="Search" className="mr-sm-2" />
      <Button variant="outline-success">Search</Button>
    </Form>
  </Navbar.Collapse>
</Navbar>`

       </div>
    );
}
 
export default Navigation;