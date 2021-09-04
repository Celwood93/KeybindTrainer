import React, { Fragment, useState, useEffect, useContext } from 'react';
import {
	Grid,
	Typography,
	Tooltip,
	Button,
	GridListTileBar,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import {
	getNextKey,
	characterKeybindings,
	validatePress,
	verifyKey,
} from '../../utils/utils';
import { removeWaterMark } from '../../utils/toolTipHooks';
import { AllSpellsContext } from '../../../contexts/AllSpellsContext';
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
	const allSpells = useContext(AllSpellsContext);
	const [currentKey, setCurrentKey] = useState();
	const [existingSpell, setExistingSpell] = useState();
	const [userKeyPressed, setUserKeyPressed] = useState();

	removeWaterMark('#rapid-fire-modal a', []);

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
			const userKeyPressedFormatted = {
				key: userKeyPressed.key,
				mod: userKeyPressed.Alt
					? 'Alt'
					: userKeyPressed.Ctrl
					? 'Ctrl'
					: userKeyPressed.Shift
					? 'Shift'
					: userKeyPressed.None
					? 'None'
					: null,
			};
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
							(bind.key === userKeyPressedFormatted.key &&
								bind.mod === userKeyPressedFormatted.mod) ||
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
						(bind.key === userKeyPressedFormatted.key &&
							bind.mod === userKeyPressedFormatted.mod) ||
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

	function spellIcon() {
		return (
			<a
				data-wowhead={`https://www.wowhead.com/spell=${spellDetails.spellId}`}
				style={{ cursor: 'default' }}
			>
				<img
					src={`https://wow.zamimg.com/images/wow/icons/medium/${
						allSpells[spellDetails.spellId].iconId
					}.jpg`}
					alt=""
					style={{
						paddingTop: '10px',
						maxHeight: '36px',
					}}
				/>
			</a>
		);
	}

	return false ? (
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
							? // TODO - often existing spell has spellID: "0000" so spellname doesnt work
							  ` Already exists for ${existingSpell.spellName}, overwriting`
							: ''}
						. Press same key to confirm.
					</div>
				)}
			</div>
		</Fragment>
	) : (
		<Fragment>
			<div style={{ backgroundColor: 'black', height: '50%' }}>
				<Grid
					container
					style={{
						height: '50%',
						alignContent: 'center',
					}}
				>
					<Grid
						container
						md={12}
						spacing={2}
						style={{
							justifyContent: 'center',
						}}
					>
						<Grid item>{spellIcon()}</Grid>
						<Grid item>
							<Typography
								style={{ color: 'white' }}
								variant="h3"
								align="center"
							>
								{spellDetails && spellDetails.spellName}
							</Typography>
						</Grid>
						<Grid item>{spellIcon()}</Grid>
					</Grid>
					<Grid item md={12}>
						<Typography
							style={{ color: 'white' }}
							variant="h4"
							align="center"
						>
							on
						</Typography>
					</Grid>
					<Grid item md={12}>
						<Typography
							style={{ color: 'white' }}
							variant="h3"
							align="center"
						>
							{currentSpell && currentSpell.target}
						</Typography>
					</Grid>
				</Grid>
				<Grid
					container
					style={{
						height: '50%',
						alignContent: 'center',
					}}
				></Grid>
			</div>
		</Fragment>
	);
}

export default RapidFireModalActionGame;
