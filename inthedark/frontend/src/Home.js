// REACT
import React, { Component } from 'react';
// CSS, BOOTSTRAP and ADDONS
import './Home.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactCSSTransitionGroup from 'react-transition-group';
// REFERENCES
//https://stackoverflow.com/questions/6805482/css3-transition-animation-on-load




class JoinChatButtons extends Component {
  render() {
    return(
      <Container>
        <Row className="justify-content-md-center">
          <Col>
            <Button variant="dark" size="lg" className="BtnFloatRight">Create Room</Button>
          </Col>
          <Col>
            <Button variant="info" size="lg" >Join Room</Button>
          </Col>
        </Row>
      </Container>
    )
  }
}

class Home extends Component {
  constructor(props) {
    super(props)
  }
  componentDidMount() {
    window.onload = function() {
      document.getElementById("homeTitle").className += " loaded"
      document.getElementById("joinChatButtons").className += " loaded"
    }

  }
  render() {
    return (
      <div className="HomeCenter">
        <Container>
          <Row className="justify-content-md-center">
            <Col>
              <div id="homeTitle" className="Title">
                <p>in the dark</p>
              </div>
            </Col>
          </Row>
          <Row className="justify-content-md-center">
            <Col>
              <div id="joinChatButtons" className="JoinChatButtons">
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
