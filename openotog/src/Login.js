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
            <Row>
            <div className="col-md-6 mt-5 mx-auto">
                <form noValidate onSubmit={this.onSubmit}>
                <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
                <div className="form-group">
                    <label htmlFor="username">Email address</label>
                    <input
                    type="username"
                    className="form-control"
                    name="username"
                    placeholder="Enter username"
                    value={this.state.username}
                    onChange={this.onChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Password"
                    value={this.state.password}
                    onChange={this.onChange}
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-lg btn-primary btn-block"
                >
                    Sign in
                </button>
                </form>
            </div>
            </Row>
        </Container>
    )
  }
}

export default Login
