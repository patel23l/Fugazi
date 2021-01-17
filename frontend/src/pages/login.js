import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import loginImg from "./lock.svg";
import './style.css';

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
    const headers = {
      'Content-Type': 'x-www-form-urlencoded',
      'Authorization': 'Bearer'
    };
    const { email, password } =  this.state;

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
        if (response.data.logged) {
          this.props.handleSuccessfulAuth(response.data);
        }
      })
      .catch(error => {
        console.log('login error', error);
      });
    event.preventDefault();
  }

  render (){
    return (
      <div class="container" id="container">
      <Form onSubmit={this.handleSubmit}>
      <div class="form-container sign-up-container">
        <Form.Group size="lg" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            name="email"
            type="email"
            value={this.state.email}
            onChange={this.handleChange}
          />
        </Form.Group>
        </div>
        <div class="form-container sign-up-container">
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            name="password"
            type="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
        </Form.Group>
        </div>
        <Button block size="lg" type="submit" >Login</Button>
      </Form>
      </div>
    )
    }
}

/*
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

if(signUpButton){
  signUpButton.addEventListener('click', () => {
    container.classList.add('right-panel-active');
  });
}

if(signInButton){
  signInButton.addEventListener('click', () => {
    container.classList.remove('right-panel-active');
  });
}
return (
  <div class="container" id="container">
<div class="form-container sign-up-container">
<form action="#">
  <h1>Create Account</h1>
  <input type="text" placeholder="Name" />
  <input type="email" placeholder="Email" />
  <input type="password" placeholder="Password" />
  <button>Sign Up</button>
</form>
</div>
<div class="form-container sign-in-container">
<form action="#">
  <h1>Sign in</h1>
  <input type="email" placeholder="Email" />
  <input type="password" placeholder="Password" />
  <a href="#">Forgot your password?</a>
  <button>Sign In</button>
</form>
</div>
<div class="overlay-container">
<div class="overlay">
  <div class="overlay-panel overlay-left">
    <h1>Welcome Back!</h1>
    <p>To keep connected with us please login with your personal info</p>
    <button class="ghost" id="signIn">Sign In</button>
  </div>
  <div class="overlay-panel overlay-right">
    <h1>Fugazi</h1>
    <p>Enter your personal details and start journey with us</p>
    <button class="ghost" id="signUp">Sign Up</button>
  </div>
</div>
</div>
</div>
);
*/



/*
export default function Login() {
    /*
    Jared old code: 

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function validateForm() {
      return email.length > 0 && password.length > 0;
  }

    function handleSubmit(event) {
        event.preventDefault();

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
    }*/

 
