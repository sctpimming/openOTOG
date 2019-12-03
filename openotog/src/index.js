import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';
import Footer from './Footer';
import Body from './Body';


// Importing the Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.render(<Header />, document.getElementById('Header'));
ReactDOM.render(<Footer />, document.getElementById('Footer'));
ReactDOM.render(<Body />, document.getElementById('Body'));



