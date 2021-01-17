import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import loginImg from "./lock.svg";
import './style.css';
import Cookies from "js-cookie";
import {BACKEND_URL} from '../constants';

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
    // const access_token_var = Cookies.get('access_token');
    const headers = {
      'Content-Type': 'application/json'
    };
    const { email, password } =  this.state;

    axios
      .post(
        `${BACKEND_URL}/api/auth/login`,
        {
          user: {
            email: email,
            password: password,
          }
        },
        { headers: headers }
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
  btnLogin() {
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
  }

  render (){
/*    
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
*/
 
      return (
        <div class="container" id="container">
    <div class="form-container sign-up-container">
      <form 
        autoFocus
        name="email"
        type="email"
        value={this.state.email}
        onChange={this.handleChange}>
        <h1>Create Account</h1>
        <input type="text" placeholder="Name" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button>Sign Up</button>
      </form>
    </div>
    <div class="form-container sign-in-container">
      <form             
        name="password"
        type="password"
        value={this.state.password}
        onChange={this.handleChange}>
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
          <p>Sign in to start your video analysis!</p>
          <button class="ghost" id="signIn">Sign In</button>
        </div>
        <div class="overlay-panel overlay-right">
          <h1>Join Us</h1>
          <p>Sign up to join the big brother surveillance team.  George Orwell welcomes you.</p>
          <button class="ghost" id="signUp">Sign Up</button>
        </div>
      </div>
    </div>
  </div>
      );
      }
    }
  
      /*
      export default function Login() {
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
          <p>Sign in to start your video analysis!</p>
          <button class="ghost" id="signIn">Sign In</button>
        </div>
        <div class="overlay-panel overlay-right">
          <h1>Join Us</h1>
          <p>Sign up to join the big brother surveillance team.  George Orwell welcomes you.</p>
          <button class="ghost" id="signUp">Sign Up</button>
        </div>
      </div>
    </div>
  </div>
      );
      */
