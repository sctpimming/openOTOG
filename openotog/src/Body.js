import React, { useState } from "react";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import "./App.css";

class Problem extends React.Component{
    render(){
        return(
            <Card>
                <Card.Header as = "h5">
                    Problem 1 {this.props.name}
                </Card.Header>

                <Row>
                    <Col>
                        <Card.Body>
                            <Form.Control type="file" placeholder="Select file" />
                            <br></br>   
                            <Button variant="primary" type ="submit">
                                Submit
                            </Button>

                            <Row>
                                <Col>
                                    <Button>View PDF</Button>
                                </Col>
                                <Col>
                                    <Button>View Testcase</Button>
                                </Col>
                            </Row>
                            
                        </Card.Body>
                    </Col>
                    <Col>
                        <br></br>
                        <Table bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Result</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>PPPPPPPPPP</td>
                                    <td>100</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>PTPPPPPPPP</td>
                                    <td>90</td>
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>P-PPPPPPPP</td>
                                    <td>90</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                    <Col xs={1}></Col>
                </Row>
            </Card>
        );
    }
}

class Timer extends React.Component{
    constructor(){
        super();
        this.state = {
            time: {}, 
            seconds: 5000
        }
        this.timer = 0;
        this.countdown = this.countdown.bind(this);
    }
    secondsToTime(secs){
        let hour = Math.floor(secs/ (60*60));

        let minuteDivisor = secs % (60 * 60);
        let minute = Math.floor(minuteDivisor/ 60);

        let secondsDivisor = minuteDivisor % 60;
        let second = Math.ceil(secondsDivisor);

        let time = {
            "h" : hour,
            "m" : minute,
            "s" : second
        };
        return time;
    }

    componentDidMount() {
        this.setState({ seconds: this.props.CountFrom});
        let timeleft = this.secondsToTime(this.state.seconds);
        this.setState({ time: timeleft});
        if (this.timer == 0 && this.state.seconds > 0){
            this.timer = setInterval(this.countdown, 1000);
        }   
    }

    countdown(){
        let seconds = this.state.seconds - 1;
        this.setState({
            time : this.secondsToTime(seconds),
            seconds : seconds,
        });

        if(seconds == 0){
            clearInterval(this.timer);
        }
    }

    render(){
        return(
            <div>
                {this.state.time.h} hr : {this.state.time.m} m : {this.state.time.s} s
            </div>
        )
    }
}
class Annoucement extends React.Component{
    render(){
        var timee = 50;
        return(
            <div>
                <Card>
                    <Card.Header>Time left</Card.Header>
                    <Card.Title>
                        <Container>
                            <Row>
                            <Col xs = {2}></Col>
                            <Col>
                                <br></br>
                                <Timer CountFrom={timee}/> 
                                <br></br>
                            </Col>
                            </Row>
                        </Container>
                    </Card.Title>
                </Card>
                <br></br>
                <Card>
                    <Card.Header>Annoucement</Card.Header>
                    <Container>
                        <Card.Text><br></br>You can view help here!</Card.Text>
                    </Container>
                </Card>

            </div>
        );
    }
}

class Body extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          data: null,
        };
    }
    componentDidMount() {
        fetch('/problem')
        .then(res => res.json())
        .then(data => this.setState({data : data.problem}))
    }
    render(){
        var prob = []
        for(var e in this.state.data) {
            console.log(this.state.data[e]);
            prob.push(<Problem {...this.state.data[e]}/>)
        }
        return (
            <Container>
                <br></br>
                <Row>
                    <Col xs = {9}>
                        <div>
                            {prob}
                        </div>
                    </Col>
                    <Col>
                        <Annoucement />
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Body;
