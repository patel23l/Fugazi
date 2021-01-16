import React from 'react';
 
import { NavLink } from 'react-router-dom';
 
const Navigation = () => {
    return (
       <div>
          <NavLink to="/">Login</NavLink>
          <NavLink to="/about">Dashboard</NavLink>
          <NavLink to="/contact">Upload</NavLink>
       </div>
    );
}
 
export default Navigation;