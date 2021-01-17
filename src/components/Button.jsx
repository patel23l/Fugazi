import React from "react"
import ReactDOM from "react-dom"

function Button(){
  return (
  <form action="/">
    <input type="file" id="myFile" name="filename"/>
    <input type="text" placeholder="Enter file name"/>
    <input type="submit"/>
  </form>
  

)
}

export default Button