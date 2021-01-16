import 'bootstrap/dist/css/bootstrap.min.css';
import React, {Component} from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Navigation from "./pages/Navigation"
import axios from 'axios';
import Signup from './pages/Signup';


class App extends Component {
  constructor(props){
    super(props);

    this.handleSuccessfulAuth = this.handleSuccessfulAuth.bind(this);
    this.handleSuccessfulAuth = this.handleLogoutClick.bind(this);
  }

  handleSuccessfulAuth(data){
    this.props.handleLogin(data);
    this.props.history.push('/dashboard');
  }

  handleLogoutClick() {
    axios
      .delete('http://localhost:3000/logout', { withCredentials: true })
      .then(response => {
        this.props.handleLogout();
      })
      .catch(error => {
        console.log('logout error', error);
      });
  }

  render() {
    return(
      <BrowserRouter>
      <div>
        <Navigation/>
          <Switch>
           <Route path="/login" component={Login} exact/>
           <Route path="/singup" component={Signup} exact/>
           <Route path="/dashboard" component={Dashboard}/>
           <Route path="/upload" component={Upload}/>
           <Route component={Error}/>
         </Switch>
         <h1>Fugazi</h1>
         <h1>Status: {this.props.loggedInStatus}</h1>
         <Signup handleSuccessfulAuth={this.handleSuccessfulAuth} />
         <Login handleSuccessfulAuth={this.handleSuccessfulAuth} />
      </div> 
    </BrowserRouter>
    );
    }
}

export default App;
