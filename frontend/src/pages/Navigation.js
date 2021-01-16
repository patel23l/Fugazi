import React from 'react';
import './dash.css';
 
import { NavLink } from 'react-router-dom';
 
const Navigation = () => {
    return (
       <div className = "nav-bar">
          <ul>
            <li><a href="/">Login</a></li>
            <li><a href="/Dashboard">Dashboard</a></li>
            <li ><a href="/contact">Upload</a></li>
         </ul>
       </div>
    );
}
 
export default Navigation;