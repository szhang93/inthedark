import React, { Component } from 'react';
import axios from "axios";
import {API_URL} from './utils/API'
// CSS, BOOTSTRAP and ADDONS
import './CSS/Room.css';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';

class Chat extends Component {
  constructor (props) {
    super(props)
    this.state = {
      inputRows: 1
    }
  }
  render () {
    return(
      <Container className="chatPanel">
        <Row className="bubbleArea">
          <Col>

          </Col>
        </Row>
        <Row className="justify-content-md-center" md="auto">
          <Col className="textArea">
            <InputGroup>
              <FormControl rows={this.state.inputRows} size="lg">
              </FormControl>
              <InputGroup.Append>
              <Button variant="dark" size="lg">
                Send
              </Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Row>
      </Container>
    )
  }
}

class SetAlias extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: this.props.show
    }
    this.inputBox = React.createRef()
    this.btnSubmit = React.createRef()
    this.checkEnter = this.checkEnter.bind(this)
    this.submitClicked = this.submitClicked.bind(this)
  }
  componentDidMount() {
    this.inputBox.current.select()
  }
  checkEnter(e) {
    if(e.key == "Enter"){
      this.btnSubmit.current.click()
    }
  }
  submitClicked() {
    var nickName = this.inputBox.current.value
    if (nickName.length > 0) {
      this.props.setAlias(nickName)
      this.setState({show: false})
    }
  }
  render() {
    return(
      <Modal size="lg" show={this.state.show}>
        <Modal.Header>
          <Modal.Title>Welcome to {this.props.roomName}.</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup>
            <FormControl
              ref={this.inputBox}
              size="lg"
              onKeyPress={this.checkEnter}
              placeholder={"Alias"}
            />
            <InputGroup.Append>
              <Button variant="dark"
              ref={this.btnSubmit}
              onClick={this.submitClicked}
              type="submit"
              >Confirm</Button>
            </InputGroup.Append>
          </InputGroup>
        </Modal.Body>
      </Modal>
    )
  }
}

class Room extends Component {
  constructor (props) {
    super(props)
    this.state = {
      roomName: this.props.match.params.session,
      userId: null,
      showSetAlias: false,
      alias: ""
    }
    this.chat = React.createRef()
    this.roomNameTitle = React.createRef()
  }
  componentDidMount() {
    // setTimeout is used here to apply the initial fade in transition
    setTimeout(()=>{
      this.chat.current.className += " loaded"
      this.roomNameTitle.current.className += " loaded"
    }, 0)
    // Generate user
    console.log(API_URL + `/user?session_id=${this.state.roomName}`)
    axios.post(API_URL + `/user?session_id=${this.state.roomName}`)
      .then((res) => {
        if (res.status != 200) {
          console.log("Response status not 200.")
          return
        }
        else {
          var success = res.data.success
          var userId = res.data.user_id
          if (!success) {
            console.log("Post request for creating user returned unsuccesful")
          }
          else {
            this.setState({userId: userId})
            console.log("returned user id: ", userId)
          }
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
  setAlias(name) {
    this.setState({alias: name})
    console.log("Set alias as: ", name)
  }
  render() {
    return(
      <div className="backGround">
        {this.state.showSetAlias ?
        <SetAlias show={this.state.showSetAlias}
          setAlias={this.setAlias.bind(this)}
          roomName={this.state.roomName}/>
          :<></>}
        <Container className="fullScreen">
        <Row>
          <Col>
            <p className="roomName" ref={this.roomNameTitle}>
              {this.state.roomName}
            </p>
          </Col>
        </Row>
          <Row className="chatScreen" ref={this.chat}>
            <Col>
              <Chat userId={this.state.userId} />
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default Room
