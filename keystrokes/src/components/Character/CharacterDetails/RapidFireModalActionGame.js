import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
	getNextKey,
	characterKeybindings,
	validatePress,
	verifyKey,
} from '../../utils/utils';
import { isEqual } from 'lodash';

RapidFireModalActionGame.propTypes = {
	newKeybinds: PropTypes.array,
	currentSpell: PropTypes.object,
	setNewCurrentSpell: PropTypes.func,
	spellDetails: PropTypes.object,
};

function RapidFireModalActionGame({
	newKeybinds,
	currentSpell,
	setNewCurrentSpell,
	spellDetails,
}) {
	const [currentKey, setCurrentKey] = useState();
	const [existingSpell, setExistingSpell] = useState();
	const [userKeyPressed, setUserKeyPressed] = useState();

	useEffect(() => {
		document.body.onkeydown = handleKeyPress;
		const el = document.querySelector('#rapid-fire-modal');
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
		let time;

		function throttle2(fn, wait) {
			return function() {
				if (time + wait - Date.now() < 0) {
					fn();
					time = null;
				}
			};
		}
		el.onwheel = event => {
			event.preventDefault();
			if (!time) {
				time = Date.now();
			}
			throttle2(e => {
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
			}, 300)();
		};
		return () => {
			document.body.onkeydown = null;
			el.onmousedown = null;
			el.onwheel = null;
		};
	}, []);

	useEffect(() => {
		if (userKeyPressed) {
			if (currentKey) {
				if (isEqual(currentKey, userKeyPressed)) {
					setNewCurrentSpell(
						{
							...currentSpell,
							key: currentKey.key,
							mod: currentKey.Alt
								? 'Alt'
								: currentKey.Ctrl
								? 'Ctrl'
								: currentKey.Shift
								? 'Shift'
								: currentKey.None
								? 'None'
								: null,
						},
						existingSpell
					);
					setCurrentKey(null);
					setExistingSpell(null);
				} else {
					setCurrentKey(userKeyPressed);
					const existingKey = newKeybinds.find(
						bind =>
							(bind.key === userKeyPressed.key &&
								bind.mod === userKeyPressed.mod) ||
							(bind.spellId === currentSpell.spellId &&
								bind.target === currentSpell.target)
					);
					if (existingKey) {
						setExistingSpell(existingKey);
					}
				}
			} else {
				setCurrentKey(userKeyPressed);
				const existingKey = newKeybinds.find(
					bind =>
						(bind.key === userKeyPressed.key &&
							bind.mod === userKeyPressed.mod) ||
						(bind.spellId === currentSpell.spellId &&
							bind.target === currentSpell.target)
				);
				if (existingKey) {
					setExistingSpell(existingKey);
				}
			}
		}
	}, [userKeyPressed]);

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
			setUserKeyPressed(keyPressed);
		} else {
			//invalid keyPress
		}
	}

	return (
		<Fragment>
			<div>
				<div className="App-header">
					{spellDetails && spellDetails.spellName}
				</div>
				<div className="App-header" id="keybind-prompt" tabIndex="1">
					{currentSpell && (
						<div tabIndex="1">on {currentSpell.target}</div>
					)}
				</div>
				{currentKey && (
					<div>
						{currentKey.Alt
							? 'Alt'
							: currentKey.Ctrl
							? 'Ctrl'
							: currentKey.Shift
							? 'Shift'
							: currentKey.None
							? 'None'
							: null}{' '}
						{currentKey.key}
						{existingSpell
							? ` Already exists for ${existingSpell.spellName}, overwriting`
							: ''}
						. Press same key to confirm.
					</div>
				)}
			</div>
		</Fragment>
	);
}

export default RapidFireModalActionGame;
