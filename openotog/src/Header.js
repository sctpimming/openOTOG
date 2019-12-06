import React, { useState } from "react";
import jwt_decode from 'jwt-decode'
import { withRouter } from "react-router";
import Jumbotron from "react-bootstrap/Jumbotron";
import Toast from "react-bootstrap/Toast";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

//import "./App.css";

class Header extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            name : 'ergergre'
        }
        this.LogOut = this.LogOut.bind(this)
    }
    componentDidMount() {
        const token = localStorage.usertoken;
        if(token) {
            const decoded = jwt_decode(token);
            this.setState({name : decoded.sname})
        }
    }
    LogOut() {
        localStorage.removeItem('usertoken');
        this.props.history.push("/login")
    }
    render(){
        return (
            <Navbar bg="dark" variant = "dark" sticky="top">
                <Navbar.Brand href="#">{' '}openOTOG</Navbar.Brand>
                <font size={4} color={'white'}>{this.state.name}</font>
                <Container>
                    <p></p>
                    <Button variant = "danger" onClick={this.LogOut.bind(this)}>Logout</Button>
                </Container>
            </Navbar>
        );
    }
}

export default Header;
