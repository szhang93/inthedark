import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, BrowserRouter, Switch } from 'react-router-dom'

import Home from './Home';
import Room from './Room';
import './CSS/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// https://codeburst.io/getting-started-with-react-router-5c978f70df91
const routing = (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/:session" component={Room} />
    </Switch>
  </BrowserRouter>
)

ReactDOM.render(
  routing,
  document.getElementById('root')
);
