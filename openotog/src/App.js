import React, { useState } from "react";

import Jumbotron from "react-bootstrap/Jumbotron";
import Toast from "react-bootstrap/Toast";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";

import "./App.css";

const header = (
  <h1>Hello</h1>
);

class App extends React.Component{
  render(){
    return (
      <Container>
        <header />
      </Container>
    );
  }
}

export default App;