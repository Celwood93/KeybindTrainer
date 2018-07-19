import React, { Component, Fragment } from 'react';
import jsonVal from './info.json';
import './App.css';

import { ref } from './config/constants';

class App extends Component {
	constructor() {
		super();

		this.body = null;

		this.state = {
			options: jsonVal.options,
			keys: jsonVal.keys,
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
		} catch (error) {
			console.warn(error);
		}
	}

	handleKeyPress(e) {
		if (!e.metaKey) {
			e.preventDefault();
		}
		if (e.key !== 'Shift' && e.key !== 'Alt' && e.key !== 'Control') {
			console.log(e);
		}
	}

	pickRandomElement() {
		return this.state.keys[
			Math.floor(Math.random() * this.state.keys.length)
		];
	}

	render() {
		const randomKey = this.pickRandomElement();

		return (
			<Fragment>
				<div className="App App-header">
					{this.state.options[randomKey].name}
				</div>
				<button onClick={this.functionDo}>PRESS ME</button>
			</Fragment>
		);
	}
}

export default App;
