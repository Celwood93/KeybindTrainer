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
	refreshListener: PropTypes.bool,
};

function RapidFireModalActionGame({
	newKeybinds,
	currentSpell,
	setNewCurrentSpell,
	spellDetails,
	refreshListener,
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
	}, [refreshListener]); //this is to redo the listeners when leaving the menus

	useEffect(() => {
		if (userKeyPressed) {
			const userKeyPressedFormatted = {
				key: userKeyPressed.key,
				mod: calculateMod(userKeyPressed),
			};
			if (currentKey) {
				if (isEqual(currentKey, userKeyPressed)) {
					setNewCurrentSpell(
						{
							...currentSpell,
							key: currentKey.key,
							mod: calculateMod(currentKey),
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
					} else {
						setExistingSpell(undefined);
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
				} else {
					setExistingSpell(undefined);
				}
			}
		}
	}, [userKeyPressed]);

	useEffect(() => {
		setCurrentKey(null);
		setExistingSpell(null);
	}, [currentSpell]);

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
	//could probably move to util file
	function calculateMod(key) {
		return key.Alt
			? 'Alt'
			: key.Ctrl
			? 'Ctrl'
			: key.Shift
			? 'Shift'
			: key.None
			? 'None'
			: null;
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

	return (
		<Fragment>
			<div
				style={{ backgroundColor: 'black', height: '50%' }}
				id="keybind-prompt"
			>
				<Grid
					container
					alignContent="center"
					style={{
						height: '50%',
					}}
				>
					<Grid container spacing={2} justify="center">
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
					alignContent="center"
					style={{
						height: '50%',
						//alignContent: 'center',
					}}
				>
					{currentKey && (
						<Grid item md={12}>
							<Typography
								variant="h2"
								align="center"
								style={{ color: 'white' }}
							>
								{calculateMod(currentKey)} {currentKey.key}
							</Typography>

							<Typography
								variant="h4"
								align="center"
								style={{ color: 'white' }}
							>
								{existingSpell && // TODO - often existing spell has spellID: "0000" so spellname doesnt work
									` Already exists for ${
										allSpells[existingSpell.spellId]
											.spellName
									} on ${existingSpell.target}, overwriting.`}
							</Typography>
							<Typography
								variant="h4"
								align="center"
								style={{ color: 'white' }}
							>
								Press again to confirm.
							</Typography>
						</Grid>
					)}
				</Grid>
			</div>
		</Fragment>
	);
}

export default RapidFireModalActionGame;
