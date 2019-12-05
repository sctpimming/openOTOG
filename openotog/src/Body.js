import React, { useState } from "react";
import axios from 'axios';
import { saveAs } from 'file-saver';
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import ButtonGroup from "react-bootstrap/ButtonGroup";

//import "./App.css";

class Submission extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          best : null,
          lastest : null
        };
    }
    componentDidMount() {
        fetch('/submission/'+this.props.idProb,{
            headers: {
                authorization: localStorage.usertoken
            }
        })
        .then(res => res.json())
        .then(data => this.setState({best : data.best_submit, lastest : data.lastest_submit}))        
    }
    render(){
        var best_submission = [], last_submission = []
        for(var e in this.state.best) {
            var temp = this.state.best[e]
            best_submission.push(<tr>
                <td>Best 👍</td>
                <td>{temp.result}</td>
                <td>{temp.score}</td>
            </tr>)
        }
        for(var e in this.state.lastest) {
            var temp = this.state.lastest[e]
            last_submission.push(<tr>
                <td>Lastest</td>
                <td>{temp.result}</td>
                <td>{temp.score}</td>
            </tr>)
            this.props.ParentCallback(Number(temp.score))
        }
        return(
        <div>
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
                    {last_submission}
                    {best_submission}
                </tbody>
            </Table>
        </div>
        );
    }
}

class Problem extends React.Component{
    constructor () {
		super()
		this.state = {
            selectedFile: undefined,
            solved: false
		}
	}
	onChangeHandler=event=>{
		this.setState({
			selectedFile: event.target.files[0],
		})
		console.log(event.target.files[0])
	}
	onClickHandler = () => {
        if(this.state.selectedFile === undefined) return false
        const data = new FormData() 
        data.append('file', this.state.selectedFile)
		axios.post("/upload/"+this.props.id_Prob,data, {
			headers : {
				authorization : localStorage.usertoken
			}
        })
        .then(res => console.log(res.statusText))
        window.location.reload(false);
	}
    viewPDF = async () => {
        fetch('/pdf/'+this.props.sname, {
            method: "GET",
            headers: {
                "Content-Type": "application/pdf"
            }
        })
        .then(res => res.blob())
        .then(response => {
            const file = new Blob([response], {type: "application/pdf"});
            saveAs(file,this.props.sname+'.pdf')
        })
        .catch(error => {
            console.log(error);
        });
    };
    CallbackFunc = (ChildData) => {
        if(ChildData == 100)this.setState({solved:true})
    }

    render(){
        return(
            <div>
            <br></br>
            <Card>
                <Card.Header as = "h5">
                    Problem {this.props.index} {this.props.name} {this.state.solved}
                </Card.Header>

                <Row>
                    <Col>
                        <Card.Body>
                            <div class = "custom-file">
                                <input type = "file" class = "custom-file-input" onChange={this.onChangeHandler} id = "submit_code">                                    
                                </input>
                                <label class = "custom-file-label" for = "submit_code">Select file</label>
                            </div>
                            <br></br>
                            <br></br>
                            <Container>
                            <Row>
                                <Col></Col>
                                <Col xs = {10}>
                                    <ButtonToolbar>
                                        <ButtonGroup className = "mr-4">
                                            <Button variant="primary" type ="submit" onClick={this.onClickHandler} >
                                                Submit
                                            </Button>    
                                        </ButtonGroup>
                                        <ButtonGroup className = "mr-4">
                                                <Button variant = "secondary" onClick={this.viewPDF} >
                                                View PDF
                                            </Button>                
                                        </ButtonGroup>              
                            
                                    </ButtonToolbar>
                                </Col>
                                <Col></Col>
                            </Row>
                            </Container>
                        
                        </Card.Body>
                    </Col>
                    <Col>
                        <Submission idProb={this.props.id_Prob} ParentCallback={this.CallbackFunc}/>
                    </Col>
                    <Col xs={1}></Col>
                </Row>
            </Card>
            </div>
        );
    }
}

class Timer extends React.Component{
    constructor(){
        super();
        this.state = {
            time: {}, 
            seconds: 5000,
            isloading : true
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
        this.setState({ seconds: this.props.CountFrom });
        let timeleft = this.secondsToTime(this.state.seconds);
        this.setState({ time: timeleft});
        if (this.timer == 0 && this.state.seconds > 0){
            this.timer = setInterval(this.countdown, 1000);
        }  
        this.setState({ isloading: false });
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
        if(this.state.isloading) {
            return(
                <div>loading...</div>
            )
        }
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
                <br></br>
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
                        <br></br>
                        <Card.Text>You can view help here!</Card.Text>
                        <br></br>
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
            prob.push(<Problem {...this.state.data[e]} index= {Number(e)+1}/>)
        }
        return (
            <Container>
                
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
