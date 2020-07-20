import React, { useState, useEffect, Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import '../../stylesheets/App.css';

import { getNextKey, characterKeybindings } from '../utils/utils';

import { ref } from '../../config/constants';

Game.propTypes = {
	userInfo: PropTypes.object,
	userPath: PropTypes.string,
};
function Game({ userInfo, userPath }) {
	const [key, setKey] = useState();
	const [keyBindings, setKeyBindings] = useState();

	useEffect(() => {
		async function collectCharacterInfo() {
			const path = `/Characters/${userInfo.selectedCharacter}`;
			const snapShot = await ref.child(path).once('value');
			if (snapShot.exists()) {
				const charDetails = snapShot.val();

				collectKeybindings(
					charDetails,
					charDetails.selectedSpec,
					charDetails.specs[charDetails.selectedSpec]
						.selectedKeybindings
				);
			}
		}
		async function collectKeybindings(character, spec, keyBinding) {
			const path = `/Keybindings/${characterKeybindings(
				character,
				spec,
				keyBinding
			)}`;
			const snapShot = await ref.child(path).once('value');
			if (snapShot.exists()) {
				const k = snapShot.val();
				setKeyBindings(k);
				const newKey = getNextKey(Object.keys(k));
				console.log(newKey, Object.keys(k), k);
				setKey(newKey);
			}
		}
		collectCharacterInfo();
		// document.body.onkeydown = handleKeyPress;
		// return () => {
		// 	document.body.onkeydown = null;
		// };
	}, [userInfo]);

	useEffect(() => {
		document.body.onkeydown = handleKeyPress;
		return () => {
			document.body.onkeydown = null;
		};
	});

	function handleKeyPress(e) {
		if (!e.metaKey) {
			e.preventDefault();
		}
		const keyPressed = {
			key: e.code.toLowerCase().replace(/digit|key|left|right/i, ''),
			altKey: e.altKey,
			ctrlKey: e.ctrlKey,
			shiftKey: e.shiftKey,
		};
		console.log(keyPressed);
		if (
			keyPressed.key !== 'shift' &&
			keyPressed.key !== 'alt' &&
			keyPressed.key !== 'control'
		) {
			console.log(keyBindings, key);
			const expectedKey = keyBindings[key];
			//there is an issue here if the key is not a letter or a number, such as ` or ,
			//also issue with tab related commands (ctrl w)
			console.log(expectedKey, keyPressed);
			if (
				keyPressed.key === expectedKey.key &&
				((expectedKey.modifier === 'Control' && keyPressed.ctrlKey) ||
					(expectedKey.modifier === 'Shift' && keyPressed.shiftKey) ||
					(expectedKey.modifier === 'alt' && keyPressed.altKey) ||
					(expectedKey.modifier === 'None' &&
						!keyPressed.ctrlKey &&
						!keyPressed.altKey &&
						!keyPressed.shiftKey))
			) {
				console.log('worked?');
				const newKey = getNextKey(Object.keys(keyBindings));
				setKey(newKey);
			}
		}
	}
	// return (
	// 	<>
	// 		<div className="App-header">
	// 			{this.state.keybindings[key].spell}
	// 		</div>
	// 		<div className="App-header">
	// 			On {this.state.keybindings[this.state.key].target}
	// 		</div>
	// 	</>
	// );

	return (
		<div>
			{keyBindings && key && keyBindings[key] && keyBindings[key].Spell}
		</div>
	);
}

class App extends Component {
	constructor() {
		super();
		this.getNextKey = getNextKey.bind();
		this.body = null;

		// Initial values, I think these should be set from a webpage that occurs
		// before here. None of these db calls should be done in this class tbh
		// they should be passed from something above (no idea how to do that yet)
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
			//console.log('keybindings from the server', keybindings);

			this.setState(
				{
					keybindings,
					keys: Object.keys(keybindings),
					key: '1',
				},
				() => {
					const newKey = this.getNextKey(this.state.keys);
					this.setState({ key: newKey });
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
		console.log(e.code);
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
				<div className="App-header">
					{this.state.keybindings[this.state.key].spell}
				</div>
				<div className="App-header">
					On {this.state.keybindings[this.state.key].target}
				</div>
			</Fragment>
		);
	}
}

export default Game;
