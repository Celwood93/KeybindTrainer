import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../stylesheets/App.css';

import {
	getNextKey,
	characterKeybindings,
	validatePress,
	verifyKey,
} from '../utils/utils';

import { ref } from '../../config/constants';

Game.propTypes = {
	userInfo: PropTypes.object,
};
function Game({ userInfo }) {
	const [key, setKey] = useState();
	const [keyBindings, setKeyBindings] = useState();
	const [failedFirstTry, setFailedFirstTry] = useState(false);

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
				setKey(newKey);
			}
		}
		collectCharacterInfo();
	}, [userInfo]);

	useEffect(() => {
		document.body.onkeydown = handleKeyPress;
		return () => {
			document.body.onkeydown = null;
		};
	}, [keyBindings, key]);

	function handleKeyPress(e) {
		if (!e.metaKey) {
			e.preventDefault();
		}
		const keyPressed = {
			key: verifyKey(e.code.toLowerCase().replace(/digit|key/i, '')),
			Alt: e.altKey,
			Ctrl: e.ctrlKey,
			Shift: e.shiftKey,
			None: !(e.altKey || e.ctrlKey || e.shiftKey),
		};
		if (validatePress(keyPressed.key)) {
			const expectedKey = keyBindings[key];
			if (
				keyPressed.key === expectedKey.Key &&
				keyPressed[expectedKey.Mod]
			) {
				console.log('worked?');
				const newKey = getNextKey(Object.keys(keyBindings));
				setKey(newKey);
				setFailedFirstTry(false);
			} else {
				setFailedFirstTry(true);
			}
		}
	}

	return (
		<React.Fragment>
			<div className="App-header">
				{keyBindings &&
					key &&
					keyBindings[key] &&
					keyBindings[key].Spell}
			</div>
			<div className="App-header">
				{keyBindings && key && keyBindings[key] && (
					<div>on {keyBindings[key].Target}</div>
				)}
			</div>
			<div>
				{failedFirstTry && (
					<div>
						correct keybinding: {keyBindings[key].Mod}{' '}
						{keyBindings[key].Key}
					</div>
				)}
			</div>
		</React.Fragment>
	);
}

export default Game;
