import React, { Component } from 'react';
import '../CSS/Chat.css';

export const emojis = {
  ':)' : '/faces/happy.jpg',
  ':(' : '/faces/unhappy.jpg',
  '>:(' : '/faces/angry.jpg',
  ':\'(' : '/faces/sad.jpg'
}

class LinkPreview extends Component{
  constructor(props) {
    super(props)
  }
  render() {
    return(
      <>
      <a href={this.props.word}>{this.props.word}</a>
      </>
    )
  }
}

class Parser {
  static isFace(word) {
    return (word in emojis)
  }

  static isLink(word) {
    return (word.length > 8 &&
      ((word.substring(0,7).toLowerCase().localeCompare('http://') == 0) ||
      (word.substring(0,8).toLowerCase().localeCompare('https://') == 0)))
  }

  static displayFace(word, key) {
    return <img src={emojis[word]} key={key} className="circleImg" width="70vh" height="70vh"></img>
  }

  static parse(message) {
    var messageArray = message.split(' ')
    var text = []

    for(var i=0; i<messageArray.length; i++) {
      var word = messageArray[i]
      if (Parser.isLink(word)) {
        text.push(<LinkPreview word={word} key={i}/>)
        text.push(' ')
      }
      else if(Parser.isFace(word)) {
        text.push(Parser.displayFace(word, i))
      }
      else {
        // Plain text
        if (i != messageArray.length - 1) {
          word = word.concat(' ')
        }
        text.push(word)
      }
    }
    return text
  }
}

export default Parser
