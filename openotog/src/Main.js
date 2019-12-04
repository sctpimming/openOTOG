import React, { useState } from "react";
//import "./App.css";
import Header from './Header';
import Footer from './Footer';
import Body from './Body';
class Main extends React.Component{
    render(){
        return (
            <div>
                <Header />
                <Body />
                <Footer />
            </div>
        );
    }
}

export default Main;
