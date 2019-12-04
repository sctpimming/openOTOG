import React, { useState } from "react";
//import "./App.css";
import Header from './Header';
import Footer from './Footer';
import Body from './Body';
class Main extends React.Component{
    render(){
        if(!localStorage.usertoken) this.props.history.push("/login")
        //console.log(this.props.history);
        
        return (
            <div>
                <Header history={this.props.history}/>
                <Body />
                <Footer />
            </div>
        );
    }
}

export default Main;
