import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";


//HTTP module
import axios from 'axios';

export default class Login extends React.Component {
  state = {
    email: '',
    password: ''
  }
  validateForm() {
    return this.email.length > 0 && this.password.length > 0;
  }

  handleChange = event => {
    this.setState({email: event.target.value});
    this.setState({password: event.target.value});
  }

  handleSubmit = event => {
    event.preventDefault();
  
    const user = {
      email: this.state.email,
      password: this.state.password
    };

    const headers = {
      'Content-Type': 'x-www-form-urlencoded',
      'Authorization': 'Bearer'
    };

    axios.post('./api/auth/login', { user }, { headers })
    .then(res => {
      console.log(res);
      console.log(res.data);
    })
  }
  render (){
    return (
      <div className="Login">
      <Form onSubmit={this.handleSubmit}>
        <Form.Group size="lg" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={this.email}
            onChange={this.handleChange}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={this.password}
            onChange={this.handleChange}
          />
        </Form.Group>
        <Button block size="lg" type="submit" >
          Login
        </Button>
      </Form>
      </div>
    )
    }
/*
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function validateForm() {
      return email.length > 0 && password.length > 0;
  }

    function handleSubmit(event) {
        event.preventDefault();
    }

    return (
        <div className="Login">
        <Form onSubmit={handleSubmit}>
          <Form.Group size="lg" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              autoFocus
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group size="lg" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button block size="lg" type="submit" disabled={!validateForm()}>
            Login
          </Button>
        </Form>
      </div>
    );
    */
}
