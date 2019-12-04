import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { login } from './UserFunc'
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";

class Login extends Component {
  constructor() {
    super()
    this.state = {
      username: '',
      password: '',
      errors: {},
      redirect: false
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }
  onSubmit(e) {
    e.preventDefault()

    const user = {
      username: this.state.username,
      password: this.state.password
    }
    login(user).then(res => {
      if (res) {
        //console.log(res);
        this.props.history.push("/main")
      }
    })
  }
  
  render() {
    var redirect = this.state.redirect;
    if (redirect) {
      return <Redirect to='/main'/>;
    }
    return (
        <Container>
            <br></br>
            <br></br>
            <Row>
              <Col></Col>
              <Col xs = {6}>
                <Form onSubmit = {this.onSubmit}>
                  <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
                  <Form.Group controlId = "form_username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type = "username" name = "username" value ={this.state.username} 
                    onChange = {this.onChange} placeholder = "Enter username" />
                  </Form.Group>

                  <Form.Group controlId = "form_password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type = "password" name = "password" value = {this.state.password}
                    onChange = {this.onChange} placeholder = "Password"/>
                  </Form.Group>

                  <Button variant = "primary" type = "submit" block>
                    Sign in
                  </Button>
                </Form>
              </Col>
              <Col></Col>
            </Row>
        </Container>
    );
  }
}

export default Login
