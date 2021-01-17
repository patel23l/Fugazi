import 'bootstrap/dist/css/bootstrap.min.css';
import React, {Component} from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Upload from "./pages/upload";
import Navigation from "./pages/navigation"
import axios from 'axios';
import Signup from './pages/signup';


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
           <Route path="/signup" component={Signup} exact/>
           <Route path="/dashboard" component={Dashboard}/>
           <Route path="/upload" component={Upload}/>
           <Route component={Error}/>
         </Switch>
      </div> 
    </BrowserRouter>
    );
    }
}

export default App;
