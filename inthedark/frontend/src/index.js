import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

export const API_URL = "http://localhost:8000/api/server/";
ReactDOM.render(
  <App />,
  document.getElementById('root')
);
