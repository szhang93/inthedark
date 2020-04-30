import React, { Component } from 'react';
import axios from "axios";
import {API_URL} from './utils/API'
import BubbleList from './utils/BubbleList'
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

// Max number of bubbles allowed in a chat before older bubbles get deleted
const maxBubbles = 50
// Max length of a message that can be sent
const maxMessageLen = 200
// Color texts you can have
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
// Socket message codes
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
      bubbles: new BubbleList(),
      users: 0,
      myColor: '#f54242'
    }
    this.inputBox = React.createRef()
    this.sendButton = React.createRef()
    this.chatEnd = React.createRef()
    this.sendMessage = this.sendMessage.bind(this)
    this.postMessage = this.postMessage.bind(this)
    this.postSystemMessage = this.postSystemMessage.bind(this)
    this.checkEnter = this.checkEnter.bind(this)
    this.inputChanged = this.inputChanged.bind(this)


    this.sock = io.connect(API_URL, {
      reconnect: true,
      query: `user_id=${this.props.userId}&user_alias=${this.props.userAlias}&room=${this.props.roomName}`
    })

    this.sock.on(this.props.roomName, (msg) => {
      console.log("users count ", this.state.users)
      if (msg.type == msgCode.CONNECTION) {
        this.postSystemMessage(msg.message)
        this.setState({users: this.state.users + 1})
      }
      else if (msg.type == msgCode.DISCONNECT) {
        this.postSystemMessage(msg.message)
        this.setState({users: this.state.users - 1})
      }
      else if (msg.type == msgCode.MESSAGE) {
        this.postMessage(msg.user_alias, msg.message, msg.timeStamp, msg.color)
      }
    })

  }
  bubbleList () {
    if (!this.state) {
      return <></>
    }
    var messages = []
    var node = this.state.bubbles.getHead
    console.log(this.state.bubbles)
    while(node) {
      messages.push(
        <li key={node.key} style={{"listStyleType": "none"}}>
          {node.element}
        </li>
      )
      node = node.next
    }
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

    // Push new bubble onto bubbles
    this.state.bubbles.push(newBubble)
    // If we are at max capacity, deleted oldest bubble
    if (this.state.bubbles.getSize > maxBubbles) {
      this.state.bubbles.deleteFront()
    }
    this.forceUpdate()
  }
  postSystemMessage (message) {
    const systemMessage= <p className="systemMessage">{message}</p>
    this.state.bubbles.push(systemMessage)
    // If we are at max capacity, deleted oldest bubble
    if (this.state.bubbles.getSize > maxBubbles) {
      this.state.bubbles.deleteFront()
    }
    this.forceUpdate()
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
