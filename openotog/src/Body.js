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
import Badge from "react-bootstrap/Badge";
import Modal from "react-bootstrap/Modal";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

//import "./App.css";

class MyModal extends React.Component{
    Hidemodal= () => {
        this.props.onHide(false)
    }
    render(){
        var Code = this.props.SC
        //console.log(Code);
        return (
            <Modal
              show={this.props.modalShow}
              onHide={this.Hidemodal}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
                <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                Source Code⚡⚡
                </Modal.Title>
                </Modal.Header>
              <Modal.Body>
                <SyntaxHighlighter language="cpp" style={atomOneDark}>
                    {Code}
                </SyntaxHighlighter>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.Hidemodal}>Close</Button>
              </Modal.Footer>
            </Modal>
          );
    }
}

class Submission extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          best : null,
          lastest : null,
          SC : 'test',
        };
    }
    componentDidMount() {
        fetch('/submission/'+this.props.idProb,{
            headers: {
                authorization: localStorage.usertoken
            }
        })
        .then(res => res.json())
        .then(data => {
            this.setState({best : data.best_submit, lastest : data.lastest_submit})
            this.sendData()     
        })
    }
    sendData = () => {
        if(this.state.lastest[0] !== undefined)this.props.ParentCallback(this.state.lastest[0].score);
    }
    HideSc = event => {
        this.setState({showSc : event})
    }
    ShowBest = () => {
        this.setState({showSc : true, SC : this.state.best[0].scode})
    }
    ShowLast = () => {
        this.setState({showSc : true, SC : this.state.lastest[0].scode })
    }
    quickResend = e => {
        axios.post('/quickresend',{id : e})
        window.location.reload(false);
    }
    render(){
        //console.log('submit ' + this.state.best);
        var best_submission = [], last_submission = []
        for(var e in this.state.best) {
            var temp = this.state.best[e]
            best_submission.push(<tr key={e}>
                <td>Best 👍</td>
                <td>{temp.result}</td>
                <td>{temp.score}</td>
                <ButtonGroup size="sm">
                    <Button onClick={this.ShowBest.bind(this)}> * </Button>
                    <Button onClick={this.quickResend.bind(this,temp.idResult)}>♻</Button>
                </ButtonGroup>
            </tr>)
        }
        for(var e in this.state.lastest) {
            var temp = this.state.lastest[e]
            last_submission.push(<tr key={e}>
                <td>Lastest</td>
                <td>{temp.result}</td>
                <td>{temp.score}</td>
                <Button onClick={this.ShowLast.bind(this)}> * </Button>
            </tr>)
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
            <MyModal modalShow={this.state.showSc} onHide={this.HideSc} SC={this.state.SC} />
        </div>
        );
    }
}

class Problem extends React.Component{
    constructor () {
		super()
		this.state = {
            selectedFile: undefined,
            fileName: 'Select file',
            solved: false
		}
	}
	onChangeHandler=event=>{
        var name = 'Select file'
        if(event.target.files[0]!==undefined) name = event.target.files[0].name
		this.setState({
            selectedFile: event.target.files[0],
            fileName: name
		})
		//console.log(event.target.files[0])
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
                    Problem {this.props.index} {this.props.name + ' '}
                    {this.state.solved && <Badge variant = "success">Solved</Badge>}
                </Card.Header>

                <Row>
                    <Col>
                        <Card.Body>
                            <div className = "custom-file">
                                <input type = "file" className = "custom-file-input" onChange={this.onChangeHandler} id="submit_code" />
                                <label className="custom-file-label" htmlFor="submit_code">{this.state.fileName}</label>
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
            finish_time: 1,
        }
        this.timer = 0;
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
        this.setState({ finish_time: this.props.CountTo-25200 });
        let timeNow = Math.floor((Date.now())/1000)
        let seconds = this.props.CountTo- 25200 - timeNow;
        let timeleft = this.secondsToTime(seconds);
        this.setState({ time: timeleft});
        if (this.timer == 0 && this.state.finish_time > 0){
            this.timer = setInterval(this.countdown, 1000);
        }  
    }
    countdown = () => {
        let timeNow = Math.floor((Date.now())/1000)
        let seconds = this.state.finish_time - timeNow;
        //console.log(seconds);
        
        this.setState({
            time : this.secondsToTime(seconds),
        });
        if(seconds <= 0){
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
        var timee = 1575563400;
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
                                <Timer CountTo={timee}/> 
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
            prob.push(<Problem key={e} {...this.state.data[e]} index= {Number(e)+1}/>)
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