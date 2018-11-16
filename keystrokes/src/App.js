import React, { Component, Fragment } from 'react';
import './App.css';
import {handleKeyPress} from './keyStrokeHandler';

import { pickRandomElement } from './utils/utils.js';

import { ref } from './config/constants';

class App extends Component {
	constructor() {
		super();
		this.pickRandomElement = pickRandomElement.bind();
		this.handleKeyPress = handleKeyPress.bind(this, 'Parameter');
		this.body = null;

		//Initial values, I think these should be set from a webpage that occurs before here. None of these db calls should be done in this class tbh
		//they should be passed from something above (no idea how to do that yet)
		this.state = {
			keybindings: { gettingStarted: { spell: 'getting started!' } },
			keys: ['gettingStarted'],
			key: 'gettingStarted',
		};
	}

	async componentDidMount() {
		this.body = document.querySelector('body');
		this.body.onkeydown = this.handleKeyPress;

		try {
			const snapshot = await ref.child('/Keybindings/1').once('value');
			const keybindings = snapshot.val();
			console.log('keybindings from the server', keybindings);

			this.setState(
				{
					keybindings,
					keys: Object.keys(keybindings),
					key: '1',
				},
				() => {
					this.pickRandomElement(this);
				}
			);
		} catch (error) {
			console.warn(error);
		}
	}

	render() {
		return (
			<Fragment>
				<div className="App App-header">
					{this.state.keybindings[this.state.key].spell}
				</div>
				<div className="App App-header">
					On {this.state.keybindings[this.state.key].target}
				</div>
			</Fragment>
		);
	}
}

export default App;
