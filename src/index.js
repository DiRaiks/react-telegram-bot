import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
// import {Test} from './routes';

ReactDOM.render(
    <Router>
        <Switch>
            <Route path='/test' component={App}/>
            <Route path='/' component={App}/>
        </Switch>
    </Router>, document.getElementById('root'));
registerServiceWorker();