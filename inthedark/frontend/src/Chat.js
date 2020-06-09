import React, { Component } from 'react';
import axios from "axios";
import {API_URL} from './utils/API'
import BubbleList from './utils/BubbleList'
import Parser from './utils/ParseMessage'
import {emojis} from './utils/ParseMessage'
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
  "#9aede6", // Cyan
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
          {this.props.showTimeStamp?
          <div>
            <div className = "userAlias">
              {this.props.userAlias}
            </div>

            <div className = "timeStamp" >
              {this.props.timeStamp}
            </div>
          </div>:<></>}
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
      myColor: '#f54242',
      showEmojis: false
    }
    this.inputBox = React.createRef()
    this.sendButton = React.createRef()
    this.emojiButton = React.createRef()
    this.chatEnd = React.createRef()
    this.sendMessage = this.sendMessage.bind(this)
    this.postMessage = this.postMessage.bind(this)
    this.postSystemMessage = this.postSystemMessage.bind(this)
    this.checkEnter = this.checkEnter.bind(this)
    this.inputChanged = this.inputChanged.bind(this)
    this.updateUserCount = this.updateUserCount.bind(this)
    this.emojiPopup = this.emojiPopup.bind(this)
    this.emojiList = this.emojiList.bind(this)
    this.emojiSelect = this.emojiSelect.bind(this)

    this.sock = io(API_URL, {
      reconnect: false,
      query: `user_id=${this.props.userId}&user_alias=${this.props.userAlias}&room=${this.props.roomName}`
    }).connect()

    this.sock.on(this.props.roomName, (msg) => {
      //console.log("users count ", this.state.users)
      if (msg.type == msgCode.CONNECTION) {
        this.updateUserCount()
        this.postSystemMessage(msg.message)
      }
      else if (msg.type == msgCode.DISCONNECT) {
        this.updateUserCount()
        this.postSystemMessage(msg.message)
      }
      else if (msg.type == msgCode.MESSAGE) {
        this.postMessage(msg.user_alias, msg.message, msg.time_stamp, msg.color)
      }
    })

  }
  updateUserCount() {
    // Get user count for this session
    //console.log(API_URL + `/user_count?session_id=${this.props.roomName}`)
    axios.get(API_URL + `/user_count?session_id=${this.props.roomName}`)
    .then((res) => {
      if (res.status != 200) {
        console.log("Response status not 200.")
      }
      else {
        // We have to subtract 1 to offset the +1 from the socket connection
        // Detecting this user joining
        this.setState({users: res.data.count})
      }
    })
    .catch((err) => {
      console.log(err)
    })
  }
  bubbleList () {
    if (!this.state) {
      return <></>
    }
    var messages = []
    var node = this.state.bubbles.getHead
    var prev = null
    //console.log(this.state.bubbles)
    while(node) {

      messages.push(
        <li key={node.key} style={{"listStyleType": "none"}}>
          {node.element}
        </li>
      )
      prev = node
      node = node.next
    }
    return(
        messages
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
  emojiPopup () {
    this.setState({showEmojis: !this.state.showEmojis})
  }
  emojiSelect (key) {
    console.log(key)
    var emojiText = ' '.concat(key).concat(' ')
    this.inputBox.current.value = this.inputBox.current.value.concat(emojiText)
  }
  emojiList () {
    var keyList = Object.keys(emojis)
    var list = keyList.map((key) => {
      return(
        <img src={emojis[key]}
          key={key}
          onClick={()=>{this.emojiSelect(key)}}
          className="circleImg"
          width="70vh"
          height="70vh"></img>)
    })
    return list
  }

  getCurrentTime (miliseconds) {
    var date = new Date()
    var currentTime = new Date(miliseconds + date.getTimezoneOffset())

    var time = ''
    var currentHour = currentTime.getHours()
    var currentMinute = currentTime.getMinutes()
    if (currentHour < 10) {
      time = time.concat('0')
    }
    time = time.concat(currentHour).concat(':')
    if (currentMinute < 10) {
      time = time.concat('0')
    }
    time = time.concat(currentMinute)

    return(
    `${time}
    ${currentTime.getMonth()+1}/${currentTime.getDate()+1}/${currentTime.getYear()-100}
    `)
  }
  sendMessage () {

    var date = new Date()
    if (!this.inputBox.current.value) {return}
    const bubble = {
      user_id: this.props.userId,
      user_alias: this.props.userAlias,
      message: this.inputBox.current.value,
      color: this.state.myColor,
      room: this.props.roomName,
      time_stamp: date.getTime()
    }
    this.sock.emit("bubble", bubble)
    this.inputBox.current.value = ""
  }
  postMessage (userAlias, message, timeStamp, color) {
    // If we are at max capacity, deleted oldest bubble
    if (this.state.bubbles.getSize > maxBubbles) {
      this.state.bubbles.deleteFront()
    }
    //console.log(message)
    const prevBubble = this.state.bubbles.getTail
    // We omit the timestamp and userAlias display if it's from the same user
    // AND if the message was sent less than 5 minutes apart

    var showTimeStamp = true
    if (prevBubble && prevBubble.element.props.userAlias == userAlias &&
        (timeStamp - prevBubble.element.props.timeStampMilliseconds) < 300000) {

      showTimeStamp = false
    }
    const newBubble = <Bubble userAlias={userAlias}
                      text={Parser.parse(message)}
                      timeStamp={this.getCurrentTime(timeStamp)}
                      timeStampMilliseconds={timeStamp}
                      color={color}
                      showTimeStamp={showTimeStamp}/>

    // Push new bubble onto bubbles
    this.state.bubbles.push(newBubble)
    this.chatEnd.current.scrollIntoView()
    this.forceUpdate()
  }
  postSystemMessage (message) {
    // If we are at max capacity, deleted oldest bubble
    if (this.state.bubbles.getSize >= maxBubbles) {
      this.state.bubbles.deleteFront()
    }
    const systemMessage= <p className="systemMessage">{message}</p>
    this.state.bubbles.push(systemMessage)
    this.chatEnd.current.scrollIntoView()
    this.forceUpdate()
  }
  componentDidUpdate () {
    this.chatEnd.current.scrollIntoView()
  }
  componentDidMount () {
    this.inputBox.current.select()
    // Choose random color for user.
    var myColorIdx = Math.floor(Math.random() * colors.length)
    //console.log("Setting color to: ", colors[myColorIdx])
    this.setState({myColor: colors[myColorIdx]})
  }
  render () {
    return(
      <Container className="chatPanel">
        <Row className="bubbleArea">
          <div className="scrollArea">
            {this.bubbleList()}
            <div className = "chatEnd" ref={this.chatEnd}></div>
          </div>
          {this.state.showEmojis?
          <div className="emojiArea">
            {this.emojiList()}
          </div>
          :<></>}
        </Row>
        <Row className="justify-content-md-center" md="auto">
          <Col className="textArea">
            <InputGroup>
              <InputGroup.Append>
              <Button variant="outline-dark"
                size="lg"
                ref={this.emojiButton}
                onClick={this.emojiPopup}>
                emoji
              </Button>
              </InputGroup.Append>
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
