// import React from 'react';
// import JSONDATA from './MOCK_DATA.json';
import {useState} from 'react';
import './dash.css'

import React, {Component} from 'react';
import axios from "axios";
import {ProgressBar} from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import './upload.css';
import Cookies from "js-cookie";
import {BACKEND_URL} from '../constants';

import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import SelectSearch from 'react-select-search';
export default class Dashboard extends Component {
   constructor(props) {
      super(props);
        this.state = {
          labels: [{name: "NONE", value: "NONE"}],
          rowData: []
        }
        axios.get(`${BACKEND_URL}/api/video/labels`, {
           headers: {
              'Authorization': `Bearer ${Cookies.get("access_token")}`
           }
        })
        .then(res => { // then print response status
          //  toast.success('upload success')
          this.state.labels.push(res.data.map((v) => {
            return {
              name: v,
              value: v
            }
          }));
        })
        .catch(err => { // then print response status
           toast.error('loading labels fail')
        });
        this.searchQuery = this.searchQuery.bind(this);
   }
   searchQuery = (event) => {
      console.log(event);
      console.log(Cookies.get("access_token"))
      if(event.value === "none") {
        axios.get(`${BACKEND_URL}/api/video/blobs`, {
           headers: {
              'Authorization': `Bearer ${Cookies.get("access_token")}`
           }
        })
        .then(res => { // then print response status
          //  toast.success('upload success')
          console.log(res.data);
        })
        .catch(err => { // then print response status
           toast.error('upload fail')
        });
      } else {
        axios.post(`${BACKEND_URL}/api/video/query`, {
          label: event.value
        }, {
           headers: {
              'Authorization': `Bearer ${Cookies.get("access_token")}`
           }
        })
        .then(res => { // then print response status
          //  toast.success('upload success')
          console.log(res.data);
        })
        .catch(err => { // then print response status
           toast.error('upload fail')
        });
      }
      
   }
   render(){
      return(
         <div class="container">
            <div class="row">
               <div class="offset-md-3 col-md-6">
                  <SelectSearch onChange={this.searchQuery} options={this.state.labels} value="NONE" name="object" placeholder="Choose your object"/>
             </div>
             <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
            <AgGridReact
                rowData={this.state.rowData}>
                <AgGridColumn field="Name"></AgGridColumn>
                <AgGridColumn field="ObjectID"></AgGridColumn>
                <AgGridColumn field="Duration"></AgGridColumn>
            </AgGridReact>
        </div>
          </div>
         </div>
        );
      }
}

// function Dashboard() {

//   const[searchTerm, setSearchTerm] = useState('')

//   return (
//     <div className="dash"> 
//       <input type="text" placeholder="Search..."  
//       onChange={event => {
//         setSearchTerm(event.target.value)}}></input>
//       {JSONDATA.filter((val) => {
//         if (searchTerm == "") {
//           return val;
//         }
//         else if (val.first_name.toLowerCase().includes(searchTerm.toLowerCase())) {
//           return val;
//         }
//       }).map((val, key) => {
//         return <div className="user" key={key}> <p>{val.first_name}</p>
//           </div>
//       })}
//     </div>
//   );
// }

// export default Dashboard;