import React from 'react';
import ReactDOM from 'react-dom';
import Home from './Home';
import './index.css';

import 'bootstrap/dist/css/bootstrap.min.css';

export const API_URL = "http://localhost:8000/api/server/";
ReactDOM.render(
  <Home />,
  document.getElementById('root')
);
