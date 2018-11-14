import React, { Component, Fragment } from 'react';
import './App.css';

import { ref } from './config/constants';

class App extends Component {
	constructor() {
		super();

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
					this.pickRandomElement();
				}
			);
		} catch (error) {
			console.warn(error);
		}
	}

	handleKeyPress = e => {
		if (!e.metaKey) {
			e.preventDefault();
		}
		const keyPressed = {
			key: e.code.toLowerCase().replace(/digit|key|left|right/i, ''),
			altKey: e.altKey,
			ctrlKey: e.ctrlKey,
			shiftKey: e.shiftKey,
		};
		if (
			keyPressed.key !== 'shift' &&
			keyPressed.key !== 'alt' &&
			keyPressed.key !== 'control'
		) {
			let expectedKey = this.state.keybindings[this.state.key];
			//there is an issue here if the key is not a letter or a number, such as ` or ,
			if (
				keyPressed.key === expectedKey.key &&
				((expectedKey.modifier === 'CONTROL' && keyPressed.ctrlKey) ||
					(expectedKey.modifier === 'SHIFT' && keyPressed.shiftKey) ||
					(expectedKey.modifier === 'ALT' && keyPressed.altKey) ||
					(expectedKey.modifier === 'NONE' &&
						!keyPressed.ctrlKey &&
						!keyPressed.altKey &&
						!keyPressed.shiftKey))
			) {
				this.pickRandomElement();
			}
		}
	};

	pickRandomElement = () => {
		const randomKey = this.state.keys[
			Math.floor(Math.random() * this.state.keys.length)
		];
		this.setState({ key: randomKey });
	};

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
