// REACT
import React, { Component } from 'react';
import axios from "axios";
import {API_URL} from './utils/API'
import { Redirect } from "react-router-dom";
// CSS, BOOTSTRAP and ADDONS
import './CSS/Home.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Alert from 'react-bootstrap/Alert';

const btnState = {
  NONE: 0,
  CREATE: 1,
  JOIN: 2
}
const maxNameLen = 100;

class Input extends Component {
  constructor(props){
    super(props)
    this.state = {
      inputText: "",
      alertMsg: "",
      alertShow: false
    }
    this.btnSubmit = React.createRef();
    this.inputBox = React.createRef();
    this.buttonType = this.buttonType.bind(this)
    this.submitClicked = this.submitClicked.bind(this)
    this.checkEnter = this.checkEnter.bind(this)
    this.inputChanged = this.inputChanged.bind(this)
  }
  buttonType() {
    if(this.props.type == btnState.CREATE){return "Create"}
    else if(this.props.type == btnState.JOIN){return "Join"}
  }
  checkEnter(e) {
    if(e.key == "Enter"){
      this.btnSubmit.current.click()
    }
  }
  // Returns whether string is alphanumeric
  isInputValid(string) {
    var pattern = /^(\d*\w*-*_*)+$/i
    return (pattern.test(string))
  }
  submitClicked() {
    if(this.state.inputText.length == 0){
      this.setState({
        inputText: "",
        alertMsg: "Enter a valid name for your room.",
        alertShow: true
      })
      return
    }
    else{
      // If we are creating a room
      if (this.props.type == btnState.CREATE) {
        // Immediately disable button
        this.btnSubmit.current.setAttribute("disabled", true)
        // If we are creating a new room, the session name must not exist
        //console.log(API_URL + `/session`)
        axios.post(API_URL + `/session`, {
          "session_id": this.state.inputText.toLowerCase()
        })
        .then((res) => {
          if (res.status != 200) {
            console.log("Response status not 200.")
            this.btnSubmit.current.removeAttribute("disabled")
            return
          }
          var nameExists = !res.data.success
          var userId = res.data.user_id
          var sessionId = this.state.inputText.toLowerCase()
          if (nameExists) {
            this.setState({
              alertMsg: "A room with this name already exists.",
              alertShow: true
            })
            this.btnSubmit.current.removeAttribute("disabled")
          }
          else {
            // Nagivate to Room page
            this.setState({"redirect": sessionId})
          }
        })
        .catch((err) => {
          console.log(err)
        })
      } // If we are joining a room
      else if (this.props.type == btnState.JOIN) {
        this.btnSubmit.current.setAttribute("disabled", true)
        // If we want to join a room, the session name must already exist
        // Check if session name already exists
        //console.log(API_URL + `/session_exists?session_id=${this.state.inputText}`)
        axios.get(API_URL + `/session_exists?session_id=${this.state.inputText.toLowerCase()}`)
          .then((res) => {
            if (res.status != 200) {
              console.log("Response status not 200.")
              return
            }
            var nameExists = res.data.success
            var sessionId = this.state.inputText.toLowerCase()
            if (!nameExists) {
              this.setState({
                alertMsg: "The room you are trying to join does not exist.",
                alertShow: true
              })
              this.btnSubmit.current.removeAttribute("disabled")
            }
            else {
              // Nagivate to Room page
              this.setState({"redirect": sessionId})
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }
  }
  // When input is changed, checks whether input is valid. Otherwise, show alert.
  inputChanged(e) {
    if (e.target.value.length > maxNameLen) {
      this.inputBox.current.value = e.target.value.substring(0,maxNameLen)
    }
    if(this.isInputValid(e.target.value)){
      this.setState({
        inputText: e.target.value,
        alertShow: false
      })
    }
    else{
      this.setState({
        inputText: "",
        alertMsg: "Names can only include alphanumeric, '-', '_'. \
        No spaces or special characters are allowed.",
        alertShow: true
      })
    }
  }
  componentDidUpdate(newProps) {
    // Select input box so user doesn't have to manually click it
    // Checks whether props are relevant
    if(this.props != newProps){
      if(newProps.type == btnState.CREATE || newProps.type == btnState.JOIN){
        this.inputBox.current.select()
        this.inputBox.current.value = ""
        this.setState({"inputText": ""})
      }
    }
  }
  componentDidMount() {
    // Select input box so user doesn't have to manually click it
    this.inputBox.current.select()
  }
  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    return(
      <>
        <div>
        <Alert variant="danger" show={this.state.alertShow}>
          {this.state.alertMsg}
        </Alert>
        </div>
        <div>
          <InputGroup>
            <FormControl
              ref={this.inputBox}
              size="lg"
              onKeyPress={this.checkEnter}
              placeholder={"Enter Room Name"}
              onChange={this.inputChanged}
            />
            <InputGroup.Append>
              <Button variant="dark"
              ref={this.btnSubmit}
              onClick={this.submitClicked}
              type="submit"
              >{this.buttonType()}</Button>
            </InputGroup.Append>
          </InputGroup>
        </div>
      </>
    )
  }
}

// Class holding the join/create buttons and input section
class JoinChatButtons extends Component {
  constructor(props) {
    super(props)
    this.state = {
      btnPressed: btnState.NONE
    }
    this.btnPress = this.btnPress.bind(this)
    this.inputBox = React.createRef()
  }
  // Calls getInputBox on button press
  btnPress(type, e) {
    this.setState({btnPressed: type}, this.genInputBox)
  }
  // Checks which button is pressed, and passes appropriate props
  genInputBox(){
    if(this.state.btnPressed == btnState.CREATE){
      return <Input type={btnState.CREATE}/>
    }
    else if(this.state.btnPressed == btnState.JOIN){
      return <Input type={btnState.JOIN}/>
    }
    else{
      return <></>
    }
  }
  render() {
    return(
      <Container>
        <Row className="justify-content-md-center">
          <Col>
            <Button id="CreateBtn"
            variant="dark"
            size="lg"
            className="createRoomBtn"
            onClick={()=>this.btnPress(btnState.CREATE)}
            >Create Room</Button>
          </Col>
          <Col>
            <Button id="JoinBtn"
            variant="outline-dark"
            size="lg"
            className="joinRoomBtn"
            onClick={()=>this.btnPress(btnState.JOIN)}
            >Join Room</Button>
          </Col>
        </Row>
        <Row className="rowGap"></Row>
        <Row className="justify-content-md-center">
          <Col>
            <div className="InputBox">
              {this.genInputBox()}
            </div>
          </Col>
        </Row>
      </Container>
    )
  }
}

// Home landing page class
class Home extends Component {
  constructor(props) {
    super(props)
    this.title = React.createRef();
    this.joinButtons = React.createRef();
  }
  componentDidMount() {
    // setTimeout is used here to apply the initial fade in transition
    setTimeout(()=>{
      this.title.current.className += " loaded"
      this.joinButtons.current.className += " loaded"
    }, 0)
  }
  render() {
    return (
      <div className="HomeCenter">
        <Container>
          <Row className="justify-content-md-center">
            <Col>
              <div
              className="Title"
              ref={this.title}>
                <p>in the dark</p>
              </div>
            </Col>
          </Row>
          <Row className="justify-content-md-center">
            <Col>
              <div
              className="JoinChatButtons"
              ref={this.joinButtons}
              >
                <div className="bottomMargin">
                  <p className="Description">Inthedark is a temporary chatroom creation app.</p>
                  <p className="Description">Your messages are stored locally on your browser.</p>
                  <p className="Description">Rooms are instantly deleted when empty.</p>
                </div>
                <JoinChatButtons />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Home;
