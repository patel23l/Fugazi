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
          // console.log(res.data);
          res.data.forEach(vid => {
            // blobname, uploadname, url, analysed
            let analysedStr = "";
            switch (vid.analysed) {
              case 0:
                analysedStr = "Not start"
                break;
              case 1:
                analysedStr = "Analysed!"
                break;
              case 2:
                analysedStr = "Processing!"
                break;
              case 3:
                analysedStr = "Failed :("
                break;
              default:
                break;
            }
            this.state.rowData.push({
              Name: vid.uploadname,
              ObjectID: "-",
              Duration: "-",
              Analysed: analysedStr,
              URL: vid.url
            })
          });
        })
        .catch(err => { // then print response status
           toast.error('Query failed')
        });
      } else {
        axios.post(`${BACKEND_URL}/api/video/query`, {
          label: event.value
        }, {
           headers: {
              'Authorization': `Bearer ${Cookies.get("access_token")}`
           }
        })
        .then(res => {
          res.data.forEach(vid => {
            let count=0;
            vid.forEach(object => {
              this.state.rowData.push({
                Name: vid.uploadname,
                ObjectID: count,
                Duration: object.e - object.s,
                Analysed: "Analysed!",
                URL: vid.url,
                Frames: object.frames
              })
              count++;
            })
            // blobname, uploadname, url, analysed
          });
        })
        .catch(err => { // then print response status
           toast.error('Query fail')
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
                <AgGridColumn field="Analysed"></AgGridColumn>
            </AgGridReact>
        </div>
          </div>
         </div>
        );
      }
}
