import React, { Component } from 'react';
import jsonVal from './info.json';
import './App.css';

class App extends Component {
  constructor() {
    super()
    //I dont know where to put the stuff to handle key strokes, it feels wrong to put it in the constuctor but i didnt know where else to put it
    this.body = document.querySelector('body'); 
    var modifier = ""
    this.body.onkeydown = function(e) {
      if (!e.metaKey) {
        e.preventDefault();
      }
      if(e.key !== "Shift" && e.key !== "Alt" && e.key !== "Control"){
        console.log(e);
      }

    }
    //do i have to bind every function in the constructor?
    this.pickRandomElement = this.pickRandomElement.bind(this);
    this.state = {
      options : jsonVal.options,
      keys: jsonVal.keys
    }
  }



  pickRandomElement() {
    return this.state.keys[Math.floor(Math.random()*(this.state.keys.length))];
  }

  render() {
    return (
      <React.Fragment>
      <div className="App App-header"> {this.state.options[this.pickRandom()].name} </div>,
      <button onClick={this.functionDo}>PRESSME</button>
      </React.Fragment>
    );
  }
  
}

export default App;
