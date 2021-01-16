import React, {Component} from 'react';
import logo from './fugazi_logo.png';
import './App.css';
import { BrowserRouter, Router, Route, Link, Switch } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Navigation from "./pages/Navigation"


class App extends Component {
  render() {
    return(
      <BrowserRouter>
      <div>
        <Navigation />
          <Switch>
           <Route path="/" component={Login} exact/>
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
