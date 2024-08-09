import React,{useState}from "react";
import CurrentLocation from "./currentLocation";
import "./App.css";

function App() {
  return (
    <React.Fragment>
      <div className="container">
        <CurrentLocation />
      </div>  
      <div className="footer-info">
       
        Developed by{" "}
        <a target="_blank"  rel="noreferrer" href="https://github.com/himalayaheck?tab=repositories.dev/">
          Himalaya Maharshi  &larr; Click here for more Projects
        </a>
        
      </div>
    </React.Fragment>
  );
}

export default App;
