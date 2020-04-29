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
            <div className = "timeStamp">
              {this.props.timeStamp}
            </div>
          </div>
          <div className = "bubble">
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
      users: 0
    }
    this.inputText = React.createRef()
    this.sendButton = React.createRef()
    this.chatEnd = React.createRef()
    this.sendMessage = this.sendMessage.bind(this)
    this.checkEnter = this.checkEnter.bind(this)
  }
  bubbleList () {
    console.log(this.state.bubbles)
    const messages = this.state.bubbles.map((bubble, idx) => {
      return(
        <li key={idx} style={{"list-style-type": "none"}}>
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
  sendMessage () {
    // For now, append to bubble List
    const text = this.inputText.current.value
    const newBubble = <Bubble userAlias="bob" text={text} timeStamp="10/19/2019"/>
    this.setState((prevState) => ({
      bubbles: [...prevState.bubbles, newBubble]
    }))
    this.inputText.current.value = ""
  }
  componentDidUpdate () {
    this.chatEnd.current.scrollIntoView({behavior: "smooth"})
  }
  componentDidMount () {
    this.inputText.current.select()
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
                ref={this.inputText}
                onKeyPress={this.checkEnter}>
              </FormControl>
              <InputGroup.Append>
              <Button variant="dark"
                size="lg"
                ref={this.sendButton}
                onClick={this.sendMessage}>
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
