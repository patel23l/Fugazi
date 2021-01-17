import React, {Component} from 'react';
import axios from "axios";
import {ProgressBar} from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './upload.css';
import Cookies from "js-cookie";
import {BACKEND_URL} from '../constants';

export default class Upload extends Component {
   constructor(props) {
      super(props);
        this.state = {
          selectedFile: null,
          loaded:0
        }
   }
   checkMimeType=(event)=>{
      let files = event.target.files  //get file obj
      let err = []  //message container
      const types = ['video/mp4', 'video/webm']  // list allow mime type
      // loop access array
      for(var x = 0; x<files.length; x++) {
       // compare file type find doesn't matach
           if (types.every(type => files[x].type !== type)) {
           // create error message and assign to container   
           err[x] = files[x].type+' is not a supported format\n';
         }
      };
      for(var z = 0; z<err.length; z++) {// if message not same old that mean has error 
         // discard selected file
         toast.error(err[z])
         event.target.value = null
      };
     return true;
   }
   maxSelectFile=(event)=>{
      let files = event.target.files
         if (files.length > 3) { 
             const msg = 'Only 3 images can be uploaded at a time'
             event.target.value = null
             toast.warn(msg)
             return false;
         }
      return true;
   }
   checkFileSize=(event)=>{
      let files = event.target.files
      let size = 20000000000 
      let err = []; 
      for(var x = 0; x<files.length; x++) {
         if (files[x].size > size) {
         err[x] = files[x].type+'is too large, please pick a smaller file\n';
         }
      };
      for(var z = 0; z<err.length; z++) {// if message not same old that mean has error 
         // discard selected file
         toast.error(err[z])
         event.target.value = null
      };
      return true;
    }
    onChangeHandler=event=>{
      var files = event.target.files
      if(this.maxSelectFile(event) && this.checkMimeType(event) &&    this.checkFileSize(event)){ 
      // if return true allow to setState
         this.setState({
            selectedFile: files,
            loaded:0
         })
      }
   }
   onClickHandler = () => {
      const data = new FormData() 
      for(var x = 0; x<this.state.selectedFile.length; x++) {
         data.append('file', this.state.selectedFile[x])
      };
      data.append("name", "Something cool");
      axios.post(`${BACKEND_URL}/api/video/upload`, data, {
         onUploadProgress: ProgressEvent => {
            this.setState({
            loaded: (ProgressEvent.loaded / ProgressEvent.total*100),
            })
         },
         headers: {
            'Authorization': `Bearer ${Cookies.get("access_token")}`
         }
      })
      .then(res => { // then print response status
         toast.success('upload success')
      })
      .catch(err => { // then print response status
         toast.error('upload fail')
      });
   }
   render(){
      return(
         <div class="container">
            <div class="row">
               <div class="offset-md-3 col-md-6">
                  <div class="form-group files">
                  <label>Upload Your File </label>
                  <input type="file" class="form-control" onChange={this.onChangeHandler}/>
                  </div>  
                  <div class="form-group">
                  <ToastContainer />
                  <ProgressBar max="100" color="success" value={this.state.loaded}>{ Math.round(this.state.loaded,2) }%</ProgressBar>    
                  </div> 
                  <button type="button" class="btn btn-success btn-block" onClick={this.onClickHandler}>Upload</button>
             </div>
          </div>
         </div>
        );
      }
}