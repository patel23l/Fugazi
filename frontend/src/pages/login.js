import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";


//HTTP module
import axios from 'axios';

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      loginErrors: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  validateForm() {
    return this.email.length > 0 && this.password.length > 0;
  }
  handleSubmit(event) {
    const {email, password } =  this.state

    axios
      .post(
        'http://localhost:3000/backend/api/auth/login',
        {
          user: {
            email: email,
            password: password,
          }
        },
        { withCredentials: true }
      )
      .then(response => {
        if (response.data.status == 'created'){
          this.props.handleSuccessfulAuth(response.data);
        }
      })
      .catch(error => {
        console.log('registration error', error);
      });
    event.preventDefault();

  }




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
