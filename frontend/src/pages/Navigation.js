import React from 'react';
 
import { NavLink } from 'react-router-dom';
import logo from './fugazi_logo.png';

const Navigation = () => {
    return (
       <div class="container">
        <div class="navbar-header responsive-logo">
            <a href="/" class="navbar-brand"><img src={logo} alt-text="Fugazi Logo"></img></a>
        </div>
        <nav class="navbar-collapse bs-navbar-collapse collapse" role="navigation" id="site-navigation">
			<ul id="menu-header-menu" class="nav navbar-nav navbar-right responsive-nav main-nav-list">
            <li><NavLink to="/">Login</NavLink></li>
            <li><NavLink to="/dashboard">Dashboard</NavLink></li> 
            <li><NavLink to="/upload">Upload</NavLink></li>      
            </ul>	
           
          
          
        </nav>
       </div>
    );
}
 
export default Navigation;