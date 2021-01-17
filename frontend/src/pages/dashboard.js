// import React from 'react';
// import JSONDATA from './MOCK_DATA.json';
import {useState} from 'react';
import './dash.css'

import React, {Component} from 'react';
import axios from "axios";
import {ProgressBar, Overlay, Button} from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import './upload.css';
import Cookies from "js-cookie";
import {BACKEND_URL} from '../constants';

import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import SelectSearch from 'react-select-search';

// {
//   Name: "no",
//   ObjectID: 1,
//   Duration: 2,
//   Analysed: "Analysed!",
//   URL: "https://storage.googleapis.com/video-coc2/vidursatija%40gmail.com/2e7f54879690c79eb826cdfaf81ac72b.mp4",
//   Frames: [],
//   StartTime: 1.5
// }
export default class Dashboard extends Component {
   constructor(props) {
      super(props);
        this.state = {
          labels: [{name: "NONE", value: "NONE"}],
          rowData: [],
          show: false
        }
        console.log("Cookie: ", Cookies.get("access_token"));
        axios.get(`${BACKEND_URL}/api/video/labels`, {
           headers: {
              Authorization: `Bearer ${Cookies.get("access_token")}`
           }
        })
        .then(res => { // then print response status
          //  toast.success('upload success')
          this.state.labels = [{name: "NONE", value: "NONE"}]
          // console.log(res.data);
          this.state.labels.push(...res.data.map((v) => {
            return {
              name: v,
              value: v
            }
          }));
          console.log(this.state.labels);
        })
        .catch(err => { // then print response status
          console.log(err);
           toast.error('loading labels fail')
        });
        this.searchQuery = this.searchQuery.bind(this);
   }
    onGridReady = (params) => {
      console.log("grid ready");
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
    };
    onSelectionChanged = () => {
      var selectedRows = this.gridApi.getSelectedRows();
      if(selectedRows.length == 0) {return;}
      const ourRow = selectedRows[0];
      this.state.show = true
      // console.log(ourRow);
      let videoTag = document.createElement("video");
      videoTag.width = 320;
      videoTag.height = 240;
      videoTag.currentTime = ourRow.StartTime;
      let sourceTag = document.createElement("source");
      sourceTag.src = ourRow.URL;
      videoTag.appendChild(sourceTag);
      document.getElementById("ovv").appendChild(videoTag);
      // document.querySelector("video > source").src = ourRow.URL;
      // document.querySelector("video").currentTime = ourRow.StartTime;
    };
   searchQuery = (event) => {
      console.log(event);
      console.log(Cookies.get("access_token"))
      if(event === "NONE") {
        axios.get(`${BACKEND_URL}/api/video/blobs`, {
           headers: {
              'Authorization': `Bearer ${Cookies.get("access_token")}`
           }
        })
        .then(res => { // then print response status
          //  toast.success('upload success')
          console.log(res.data);
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
              URL: vid.url,
              StartTime: 0
            })
          });
          this.gridApi.refreshCells()
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
                Frames: object.frames,
                StartTime: object.s
              })
              count++;
            })
            // blobname, uploadname, url, analysed
          });
          this.gridApi.refreshCells()
        })
        .catch(err => { // then print response status
           toast.error('Query fail')
        });
      }
   }
   render(){
      return(
         <div class="container">
            <div class="row offset-md-1 col-md-10">
               {/* <div class="offset-md-1 col-md-10"> */}
                  <SelectSearch onChange={this.searchQuery} options={this.state.labels} value="NONE" name="object" placeholder="Choose your object"/>
             {/* </div> */}
             <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
            <AgGridReact onSelectionChanged={this.onSelectionChanged.bind(this)}
                rowData={this.state.rowData}
                onGridReady={this.onGridReady.bind(this)} rowSelection="single"
                >
                <AgGridColumn field="Name"></AgGridColumn>
                <AgGridColumn field="ObjectID"></AgGridColumn>
                <AgGridColumn field="Duration"></AgGridColumn>
                <AgGridColumn field="Analysed"></AgGridColumn>
                {/* <AgGridColumn field="URL"></AgGridColumn> */}
            </AgGridReact>
            <Overlay id='ovv' placement="right">
              <div show={this.state.show}>
            <Button variant="danger" onClick={() => this.state.show=false}>
        Close
      </Button>
          <div
            style="
              backgroundColor: 'rgba(255, 255, 255, 0.85)';
              padding: '2px 10px';
              height: 100%;
              width: 100%;
              borderRadius: 3;
            "
          >
            {/* <video width="320" height="240" controls id="mainvideo">
              <source src="movie.mp4" type="video/mp4"/>
            </video> */}
          </div>
          </div>
      </Overlay>
        </div>
          </div>
         </div>
        );
      }
}