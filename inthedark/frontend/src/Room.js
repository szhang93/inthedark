import React, { Component } from 'react';
import axios from "axios";
import {API_URL} from './utils/API'
// CSS, BOOTSTRAP and ADDONS
import './CSS/Room.css';

class Room extends Component {
  constructor (props) {
    super(props)

  }
  render () {
    return(
      <div>
        {this.props.match.params.session}
      </div>
    )
  }
}

export default Room
