import React, { Component, Fragment } from 'react';
import '../../stylesheets/App.css';

import { getNextKey } from '../utils/utils.js';

import { ref } from '../../config/constants';

class App extends Component {
	constructor() {
		super();
		this.getNextKey = getNextKey.bind();
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
					const newKey = this.getNextKey(this);
					this.setState({ key: newKey });
				}
			);
		} catch (error) {
			console.warn(error);
		}
	}

	handleKeyPress = (e) => {
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
			const expectedKey = this.state.keybindings[this.state.key];
			//there is an issue here if the key is not a letter or a number, such as ` or ,
			//also issue with tab related commands (ctrl w)
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
				const newKey = this.getNextKey(this);
				this.setState({ key: newKey });
			}
		}
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
