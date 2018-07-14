import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super()

    this.state = {
      items: [
        {
          name: 'Fruit',
          expiration: 'june'
        },
        {
          name: 'veg'
        }
      ],
      newVeg: '',
    }
  }
  
  // asnc loading 
  // async componentDidMount() {
  //   const items = await getItem();

  //   this.setState({
  //     items,
  //   })
  // }

  handleChange(event) {
    const newVeg = event.target.value;
    this.setState({
      newVeg,
    })
  }

  handleAddItem() {
    console.log('adding item')
  }

  render() {
    const { items, newVeg } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>

        {items.map(({name, expiration}) => {
          return <Item name={name} expiration={expiration} />
        })}

        <button onClick={() => {
          this.handleAddItem()
        }}
        >
          Add
        </button>
        <input 
          value={newVeg} 
          onChange={(event) => {
            this.handleChange(event)
          }}
        />
      </div>
    );
  }
}

export default App;

function Item({name, expiration}) {
  return (
    <div>{name} {expiration ? <span>{expiration}</span> : null}
    </div>
    )
}