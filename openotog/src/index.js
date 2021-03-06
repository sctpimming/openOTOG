import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';
import Footer from './Footer';
import Body from './Body';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

// Importing the Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then(registration => {
        console.log('SW registered: ', registration);
      }).catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
    });
  }
//ReactDOM.render(<Header />, document.getElementById('Header'));
//ReactDOM.render(<Footer />, document.getElementById('Footer'));
//ReactDOM.render(<Body />, document.getElementById('Body'));
ReactDOM.render(<App/>, document.getElementById('React'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
//serviceWorker.unregister();

