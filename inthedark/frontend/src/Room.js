import React, { Component } from 'react';
import Chat from './Chat'
import axios from "axios";
import {API_URL} from './utils/API'
import { Redirect } from "react-router-dom";
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

const maxNameLen = 100;

class SetAlias extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: this.props.show,
      inputText: "",
      alertMsg: "",
      alertShow: false
    }
    this.inputBox = React.createRef()
    this.btnSubmit = React.createRef()
    this.randomButton = React.createRef()
    this.checkEnter = this.checkEnter.bind(this)
    this.submitClicked = this.submitClicked.bind(this)
    this.inputChanged = this.inputChanged.bind(this)
    this.randomName = this.randomName.bind(this)
  }
  componentDidMount() {
    this.inputBox.current.select()
  }
  checkEnter(e) {
    if(e.key == "Enter"){
      this.btnSubmit.current.click()
    }
  }
  // Returns whether string is alphanumeric
  isInputValid(string) {
    // REGEX is too slow
    // var pattern = /^(\d*\w*-*_*)+$/i
    // return (pattern.test(string))
    for (var i=0; i<string.length; i++) {
      if (!(string[i] == '_' ||
            string[i] == '-' ||
            string[i] >= '0' && string[i] <= '9' ||
            string[i] >= 'a' && string[i] <= 'z' ||
            string[i] >= 'A' && string[i] <= 'Z'
        )) {
          return false
        }
    }
    return true
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
        alertMsg: "Names can only include alphanumeric, '-', '_', ' '. \
        No special characters are allowed.",
        alertShow: true
      })
    }
  }
  randomName() {
    this.randomButton.current.setAttribute("disabled", true)
    axios.get(API_URL + `/random_user_alias?session_id=${this.props.roomName}`)
    .then((res) => {
      if (res.status != 200) {
        console.log("Response status not 200.")
        return
      }
      if (res.data.success) {
        this.inputBox.current.value = res.data.name
        this.setState({
          inputText: res.data.name
        })
      }
      else {
        this.setState({
          alertMsg: "Failed to retrieve a name. Try again?",
          alertShow: true
        })
      }
      this.randomButton.current.removeAttribute("disabled")
    })
    .catch((err) => {
      console.log(err)
    })
  }
  submitClicked() {
    var nickName = this.inputBox.current.value.toLowerCase()
    if (nickName.length > 0) {
      console.log("Attemping to set alias as: ", nickName)
      //console.log(API_URL + "/user_alias")
      axios.put(API_URL + "/user_with_alias", {
        session_id: this.props.roomName,
        user_alias: nickName
      })
      .then((res) => {
        if (res.status != 200) {
          console.log("Response status not 200.")
        }
        else {
          if (!res.data.success) {
            this.setState({
              alertMsg: "Someone else in this room already has this name.",
              alertShow: true
            })
          }
          else {
            this.props.setAlias(nickName)
            this.setState({show: false})
          }
        }
      })
      .catch((err) => {
        console.log(err)
      })
    }
  }
  render() {
    return(
      <Modal size="lg" show={this.state.show}>
        <Modal.Header>
          <Modal.Title>Welcome to {this.props.roomName}.</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger" show={this.state.alertShow}>
            {this.state.alertMsg}
          </Alert>
          <InputGroup>
            <FormControl
              ref={this.inputBox}
              size="lg"
              onKeyPress={this.checkEnter}
              placeholder={"Alias"}
              onChange={this.inputChanged}
            />
            <InputGroup.Append>
              <Button variant="outline-dark"
              ref={this.randomButton}
              onClick={this.randomName}
              >{"Random"}</Button>
            </InputGroup.Append>
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
      userId: null,
      showSetAlias: true,
      userAlias: "",
      loading: true
    }
    this.chat = React.createRef()
    this.roomNameTitle = React.createRef()
  }
  componentDidMount() {
    // Check if sesion is valid
    //console.log(API_URL + `/session_exists?session_id=${this.props.match.params.session}`)
    axios.get(API_URL + `/session_exists?session_id=${this.props.match.params.session.toLowerCase()}`)
    .then((res) => {
      if (res.status != 200) {
        console.log("Response status not 200.")
        return
      }
      else {
        if (!res.data.success) {
          // If sesssion doesn't exist, redirect to home page
          //console.log("session doesn't exist")
          this.setState({redirect: "/", loading: false})
        }
        else {
          this.setState({loading: false})
          setTimeout(()=>{
            this.chat.current.className += " loaded"
            this.roomNameTitle.current.className += " loaded"
          }, 0)
        }
      }
    })
    .catch((err) => {
      console.log(err)
    })
  }
  setAlias(name) {
    this.setState({userAlias: name})
  }
  render() {
    if (this.state.loading) {
      return <></>
    }
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    return(
      <div className="backGround">
        {this.state.showSetAlias ?
        <SetAlias show={this.state.showSetAlias}
          setAlias={this.setAlias.bind(this)}
          roomName={this.props.match.params.session.toLowerCase()}
          userId={this.state.userId}
          className="modal"
          ref={this.modal}/>
          :<></>}
        <Container className="fullScreen">
        <Row>
          <Col>
            <p className="roomName" ref={this.roomNameTitle}>
              {this.props.match.params.session.toLowerCase()}
            </p>
          </Col>
        </Row>
          <Row className="chatScreen" ref={this.chat}>
            <Col>
              {this.state.userAlias != "" ?
              <Chat userId={this.state.userId}
              userAlias={this.state.userAlias}
              roomName={this.props.match.params.session.toLowerCase()} />
              :<></>}
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default Room
