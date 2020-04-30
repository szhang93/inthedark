import React, { Component } from 'react';
import axios from "axios";
import {API_URL} from './utils/API'
// CSS, BOOTSTRAP and ADDONS
import './CSS/Chat.css';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import ListGroup from 'react-bootstrap/ListGroup';

import io from 'socket.io-client'

const maxMessageLen = 200;
const colors = [
  "#f54242", // Red
  "#f59342", // Orange
  "#f5d142", // Yellow
  "#e0f542", // Neon
  "#42f5d4", // Cyan
  "#42c5f5", // Blue
  "#e270ff", // Purple
  "#ff78c4", // Pink
]

const msgCode = {
  CONNECTION : 0,
  DISCONNECT : 1,
  MESSAGE : 2
}

class Bubble extends Component {
  constructor (props) {
    super(props)
  }
  render () {
    return (
      <>
        <div className = "bubbleBundle">
          <div>
            <div className = "userAlias">
              {this.props.userAlias}
            </div>
            <div className = "timeStamp" >
              {this.props.timeStamp}
            </div>
          </div>
          <div className = "bubble" style={{color: this.props.color}}>
            {this.props.text}
          </div>
        </div>
      </>
    )
  }
}
class Chat extends Component {
  constructor (props) {
    super(props)
    this.state = {
      bubbles: [],
      users: 0,
      myColor: '#f54242'
    }
    this.inputBox = React.createRef()
    this.sendButton = React.createRef()
    this.chatEnd = React.createRef()
    this.sendMessage = this.sendMessage.bind(this)
    this.postMessage = this.postMessage.bind(this)
    this.checkEnter = this.checkEnter.bind(this)
    this.inputChanged = this.inputChanged.bind(this)


    this.sock = io.connect(API_URL, {
      reconnect: true,
      query: `user_id=${this.props.userId}&user_alias=${this.props.userAlias}&room=${this.props.roomName}`
    })

    this.sock.on(this.props.roomName, (msg) => {
      if (msg.type == msgCode.CONNECTION) {

      }
      else if (msg.type == msgCode.DISCONNECT) {

      }
      else if (msg.type == msgCode.MESSAGE) {
        this.postMessage(msg.user_alias, msg.message, msg.timeStamp, msg.color)
      }
    })

  }
  bubbleList () {
    const messages = this.state.bubbles.map((bubble, idx) => {
      return(
        <li key={idx} style={{"listStyleType": "none"}}>
          {bubble}
        </li>
    )})
    return(
      <div>
        {messages}
      </div>
    )
  }
  checkEnter (e) {
    if (e.key == "Enter") {
      this.sendButton.current.click()
    }
  }
  inputChanged (e){
    if (e.target.value.length > maxMessageLen) {
      this.inputBox.current.value = e.target.value.substring(0,maxMessageLen)
    }
  }
  sendMessage () {
    const bubble = {
      user_id: this.props.userId,
      user_alias: this.props.userAlias,
      message: this.inputBox.current.value,
      color: this.state.myColor,
      room: this.props.roomName
    }
    this.sock.emit("bubble", bubble)
    this.inputBox.current.value = ""
  }
  postMessage (userAlias, message, timeStamp, color) {
    console.log(message)
    const newBubble = <Bubble userAlias={userAlias}
                      text={message}
                      timeStamp={timeStamp}
                      color={color}/>
    this.setState((prevState) => ({
      bubbles: [...prevState.bubbles, newBubble]
    }))
  }
  componentDidUpdate () {
    this.chatEnd.current.scrollIntoView()
  }
  componentDidMount () {
    this.inputBox.current.select()
    // Choose random color for user.
    var myColorIdx = Math.floor(Math.random() * colors.length)
    console.log("Setting color to: ", colors[myColorIdx])
    this.setState({myColor: colors[myColorIdx]})
  }
  render () {
    return(
      <Container className="chatPanel">
        <Row className="bubbleArea">
          <div className="scrollArea">
            {this.bubbleList()}
            <div ref={this.chatEnd}></div>
          </div>
        </Row>
        <Row className="justify-content-md-center" md="auto">
          <Col className="textArea">
            <InputGroup>
              <FormControl size="lg"
                ref={this.inputBox}
                onKeyPress={this.checkEnter}
                onChange={this.inputChanged}>
              </FormControl>
              <InputGroup.Append>
              <Button variant="dark"
                size="lg"
                ref={this.sendButton}
                onClick={this.sendMessage}
                style={{color: this.state.myColor}}>
                Send
              </Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <p className="userCount">{this.state.users} loafers in this room</p>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Chat;
