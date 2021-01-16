import logo from './fugazi_logo.png';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Login from "./pages/login";
import { Component } from 'react';

class App extends Component {
  render() {
    return(
      <BrowserRouter>
      <div>
        <Navigation />
          <Switch>
           <Route path="/login" component={Login} exact/>
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
