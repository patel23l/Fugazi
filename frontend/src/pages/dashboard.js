import React from 'react';
import JSONDATA from './MOCK_DATA.json';
import {useState} from 'react';
import './dash.css'

export default function Dashboard() {

  const[searchTerm, setSearchTerm] = useState('')

  return (
    <div>
    <div className="dash"> 
    <input type="text" placeholder="Search..."  
      onChange={event => {
        setSearchTerm(event.target.value)}}></input>
      {JSONDATA.filter((val) => {
        if (searchTerm == "") {
          return val;
        }
        else if (val.first_name.toLowerCase().includes(searchTerm.toLowerCase())) {
          return val;
        }
      }).map((val, key) => {
        return <div className="user" key={key}> <p>{val.first_name}</p>
          </div>
      })}
    </div>
    </div>
  );
}