import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { throttle } from 'lodash';
import PropTypes from 'prop-types';
import '../../stylesheets/App.css';
import { Snackbar } from '@material-ui/core';

import {
	getNextKey,
	characterKeybindings,
	validatePress,
	verifyKey,
} from '../utils/utils';
import { Alert, alerter } from '../utils/Alert';
import { AllSpellsContext } from '../../contexts/AllSpellsContext';

import { ref } from '../../config/constants';

Game.propTypes = {
	userInfo: PropTypes.object,
};
function Game({ userInfo }) {
	const [key, setKey] = useState();
	const [keyBindings, setKeyBindings] = useState();
	const [failedFirstTry, setFailedFirstTry] = useState(false);
	const [alert, setAlert] = alerter();
	const allSpells = useContext(AllSpellsContext);

	useEffect(() => {
		async function collectCharacterInfo() {
			try {
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
			} catch (e) {
				console.log(`Failed to get character info for game`);
			}
		}
		async function collectKeybindings(character, spec, keyBinding) {
			const path = `/Keybindings/${characterKeybindings(
				character,
				spec,
				keyBinding
			)}`;
			try {
				const snapShot = await ref.child(path).once('value');
				if (snapShot.exists()) {
					const rawKeys = snapShot.val();
					const detailedKeys = rawKeys.map(spell => ({
						...allSpells[spell.spellId],
						...spell,
					}));
					setKeyBindings(detailedKeys);
					const newKey = getNextKey(Object.keys(detailedKeys));
					setKey(newKey);
				}
			} catch (e) {
				console.log(`failed to get value for path ${path}`, e);
			}
		}
		collectCharacterInfo();
	}, [userInfo]);

	useEffect(() => {
		document.body.onkeydown = handleKeyPress;
		const el = document.querySelector('#root');
		el.onmousedown = event => {
			event.preventDefault();
			if (event.which === 2 && event.button === 1) {
				handleKeyPress({
					altKey: event.altKey,
					shiftKey: event.shiftKey,
					ctrlKey: event.ctrlKey,
					preventDefault: () => {
						if (event.preventDefault) {
							event.preventDefault();
						}
					},
					code: 'wheelclick',
				});
			}
		};
		el.onwheel = throttle(
			event => {
				event.preventDefault();
				if (event.deltaY > 0) {
					handleKeyPress({
						altKey: event.altKey,
						shiftKey: event.shiftKey,
						ctrlKey: event.ctrlKey,
						preventDefault: () => {
							if (event.preventDefault) {
								event.preventDefault();
							}
						},
						code: 'wheeldown',
					});
				} else {
					handleKeyPress({
						altKey: event.altKey,
						shiftKey: event.shiftKey,
						ctrlKey: event.ctrlKey,
						preventDefault: () => {
							if (event.preventDefault) {
								event.preventDefault();
							}
						},
						code: 'wheelup',
					});
				}
			},
			400,
			{ leading: true, trailing: false }
		);
		return () => {
			document.body.onkeydown = null;
			el.onmousedown = null;
			el.onwheel = null;
		};
	}, [keyBindings, key]);

	function handleKeyPress(e) {
		if (!e.metaKey) {
			e.preventDefault();
		}
		if (!keyBindings) {
			setAlert({
				open: true,
				message: (
					<div>
						<span>Please go to </span>
						<Link id="alert-link" to="/CharacterList">
							<span>character management</span>
						</Link>
						<span> and select a character to start playing.</span>
					</div>
				),
				type: 'warning',
			});
			return;
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
				keyPressed.key === expectedKey.key &&
				keyPressed[expectedKey.mod]
			) {
				let newKey = key;
				while (newKey === key) {
					newKey = getNextKey(Object.keys(keyBindings));
				}
				setKey(newKey);
				setFailedFirstTry(false);
			} else {
				setFailedFirstTry(true);
			}
		}
	}

	return (
		<React.Fragment>
			<Snackbar
				open={alert.open}
				onClose={() => setAlert({ ...alert, open: false })}
				autoHideDuration={5000}
			>
				<Alert
					onClose={() => setAlert({ ...alert, open: false })}
					severity={alert.type}
				>
					{alert.message}
				</Alert>
			</Snackbar>
			<div>
				<div className="App-header">
					{keyBindings &&
						key &&
						keyBindings[key] &&
						keyBindings[key].spellName}
				</div>
				<div className="App-header" id="keybind-prompt" tabIndex="1">
					{keyBindings && key && keyBindings[key] && (
						<div tabIndex="1">on {keyBindings[key].target}</div>
					)}
				</div>
				<div>
					{failedFirstTry && (
						<div id="failed-prompt" tabIndex="1">
							correct keybinding:{' '}
							{keyBindings[key].mod === 'None'
								? ''
								: keyBindings[key].mod}{' '}
							{keyBindings[key].key}
						</div>
					)}
				</div>
			</div>
		</React.Fragment>
	);
}

export default Game;
