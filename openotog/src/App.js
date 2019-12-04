import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Jumbotron from "react-bootstrap/Jumbotron";
import Toast from "react-bootstrap/Toast";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";

import "./App.css";
import Main from './Main';
import Login from './Login';

const header = (
  <h1>Hello</h1>
);

class App extends React.Component{
  render(){
    return (
      <Router>
        <Switch>
          <Route path='/main' component={Main}>
          </Route>
          <Route path='/login' component={Login}/>
        </Switch>
      </Router>
    );
  }
}

export default App;
