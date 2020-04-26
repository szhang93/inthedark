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
  isInputValid(string) {
    var pattern = /^(\d*\w*-*_*)+$/i
    return (pattern.test(string))
  }
  submitClicked() {
  }
  inputChanged(e) {
    if(this.isInputValid(e.target.value)){
      this.setState({
        inputText: e.target.value,
        alertShow: false
      })
    }
    else{
      this.setState({
          alertMsg: "Names can only include alphanumeric, '-', '_'. \
          No spaces or special characters are allowed.",
          alertShow: true
      })
    }
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

class JoinChatButtons extends Component {
  constructor(props) {
    super(props)
    this.state = {
      btnPressed: btnState.NONE
    }
    this.btnPress = this.btnPress.bind(this)
    this.inputBox = React.createRef()
  }
  btnPress(type, e) {
    this.setState({btnPressed: type}, this.genInputBox)
  }
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

class Home extends Component {
  constructor(props) {
    super(props)
    this.title = React.createRef();
    this.joinButtons = React.createRef();
  }
  componentDidMount() {
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
              ref={this.title}
              >
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
