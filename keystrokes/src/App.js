import React, { Component, Fragment } from 'react';
import jsonVal from './info.json';
import './App.css';

import { ref } from './config/constants';

class App extends Component {
	constructor() {
		super();

		this.body = null;
		this.pickRandomElement = this.pickRandomElement.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);

		this.state = {
			options: jsonVal.options,
			keys: jsonVal.keys,
			key: 'a'
		};
	}

	async componentDidMount() {
		this.body = document.querySelector('body');
		this.body.onkeydown = this.handleKeyPress;

		try {
			const snapshot = await ref.child('/options').once('value');
			const options = snapshot.val();
			console.log('options from the server', options);

			this.setState({ options });
			this.setState({ keys: Object.keys(options) });
		} catch (error) {
			console.warn(error);
		}
	}

	handleKeyPress(e) {
		if (!e.metaKey) {
			e.preventDefault();
		} 
		const keyPressed = {'key': e.key.toLowerCase(), 'altKey': e.altKey, 'ctrlKey': e.ctrlKey, 'shiftKey': e.shiftKey}
		if (e.key !== 'shift' && e.key !== 'alt' && e.key !== 'control') {
			console.log(e);
			if(e.key === this.state.key){
				this.pickRandomElement();
			}
		}
	}

	pickRandomElement() {
		const j = this.state.keys[
			Math.floor(Math.random() * this.state.keys.length)
		];
		this.setState({ key: j});
		console.log("pass", this.state);
	}

	render() {
		return (
			<Fragment>
				<div className="App App-header">
					{this.state.options[this.state.key].name}
				</div>
			</Fragment>
		);
	}
}

export default App;
