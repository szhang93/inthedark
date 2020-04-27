// REACT
import React, { Component } from 'react';
// CSS, BOOTSTRAP and ADDONS
import './Home.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Alert from 'react-bootstrap/Alert';
// REFERENCES
//https://stackoverflow.com/questions/6805482/css3-transition-animation-on-load
import API from './utils/API';

const btnState = {NONE:0, CREATE:1, JOIN:2}

class InputChatName extends Component {
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
      if(this.props.type == btnState.CREATE){

      }
      else if(this.props.type == btnState.JOIN){

      }
    }
  }
  // When input is changed, checks whether input is valid. Otherwise, show alert.
  inputChanged(e) {
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
      }
    }
  }
  componentDidMount() {
    // Select input box so user doesn't have to manually click it
    this.inputBox.current.select()
  }
  render() {
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
              <Button variant="outline-dark"
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
      return <InputChatName type={btnState.CREATE}/>
    }
    else if(this.state.btnPressed == btnState.JOIN){
      return <InputChatName type={btnState.JOIN}/>
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
            variant="info"
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
                  <p className="Description">Your messages are deleted once the chatroom is empty.</p>
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
