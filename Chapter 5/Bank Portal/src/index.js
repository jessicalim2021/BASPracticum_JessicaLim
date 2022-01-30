import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import '.././node_modules/bulma-start/css/main.css'
import './app.css';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory()

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
, document.getElementById('root'));