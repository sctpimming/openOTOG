import React, { useState } from "react";

import Jumbotron from "react-bootstrap/Jumbotron";
import Toast from "react-bootstrap/Toast";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

//import "./App.css";

class Header extends React.Component{
    render(){
        return (
            <Navbar bg="dark" variant = "dark" sticky="top">
                <Navbar.Brand href="#">{' '}openOTOG</Navbar.Brand>
                <Container>
                    <p1></p1>
                    <Button variant = "danger">Logout</Button>
                </Container>
            </Navbar>
        );
    }
}

export default Header;
