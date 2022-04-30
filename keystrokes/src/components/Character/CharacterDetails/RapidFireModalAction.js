import React, { useState, useEffect, Fragment } from 'react';
import {
	Grid,
	Typography,
	Tooltip,
	Button,
	Tabs,
	Tab,
} from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import { targettingDetails, targetting } from '../../../config/constants';
import update from 'immutability-helper';
import PropTypes from 'prop-types';
import DetailedDropdownConfig from './DetailedDropdownConfig';
import RapidFireModalActionGame from './RapidFireModalActionGame';
import KeybindTableRapidFire from './KeybindTableRapidFire';
import { a11yProps, TabPanel } from '../helpers/TabPanels';

RapidFireModalAction.propTypes = {
	formattedSpells: PropTypes.array.isRequired,
	spellTargetOpts: PropTypes.object, //this starts out as undefined
	setSpellTargetOpts: PropTypes.func.isRequired,
	closeInAction: PropTypes.func.isRequired,
	setAllKeybindings: PropTypes.func.isRequired,
	allKeybindings: PropTypes.object.isRequired,
	keyBindingKey: PropTypes.string.isRequired,
};

function RapidFireModalAction({
	formattedSpells,
	spellTargetOpts,
	setSpellTargetOpts,
	closeInAction,
	setAllKeybindings,
	allKeybindings,
	keyBindingKey,
}) {
	const [spellsWithoutBinds, setSpellsWithoutBinds] = useState();
	const [newKeybinds, setNewKeybinds] = useState(
		allKeybindings[keyBindingKey]
	);
	const [currentSpell, setCurrentSpell] = useState();
	const [finishedState, setFinishedState] = useState(false);
	const [spellChangesView, setSpellChangesView] = useState(
		newKeybinds && newKeybinds.length > 0 ? 1 : 0
	);
	const [refreshListener, setRefreshListener] = useState(true); // turn back on the onwheel scroll

	useEffect(() => {
		const spellIdWithTarget = Object.keys(spellTargetOpts)
			.filter(spellKey => spellTargetOpts[spellKey])
			.map(spellKey => {
				const [id, _, target] = spellKey.split(',');
				return {
					key: null,
					mod: null,
					spellId: id,
					target,
				};
			});
		setSpellsWithoutBinds(spellIdWithTarget);
	}, [spellTargetOpts, formattedSpells]); //might not need formatted spells here

	useEffect(() => {
		if (spellsWithoutBinds) {
			if (!spellsWithoutBinds.length) {
				setFinishedState(true);
				setSpellChangesView(0);
			} else {
				//could be random but w.e
				setCurrentSpell(spellsWithoutBinds[0]);
			}
		}
	}, [newKeybinds, spellsWithoutBinds]);

	function skipSpellBinding() {
		if (spellsWithoutBinds && currentSpell) {
			setSpellsWithoutBinds(
				spellsWithoutBinds.filter(
					spell =>
						!(
							spell.spellId === currentSpell.spellId &&
							spell.target === currentSpell.target
						)
				)
			);
		}
	}

	function deleteSpell(targetSpell) {
		if (targetSpell) {
			const newSpellsWithoutBinds = spellsWithoutBinds.filter(
				spell =>
					!(
						spell.spellId === targetSpell.spellId &&
						spell.target === targetSpell.target
					)
			);
			setSpellsWithoutBinds(newSpellsWithoutBinds);
			if (!newSpellsWithoutBinds.length) {
				setSpellChangesView(0);
			}
		}
	}

	function redoKeybinding(targetSpell) {
		const checkIfExists = spellsWithoutBinds.some(
			spell =>
				spell.spellId === targetSpell.spellId &&
				spell.target === targetSpell.target
		);
		setNewKeybinds(
			newKeybinds.filter(
				spell =>
					!(
						spell.spellId === targetSpell.spellId &&
						spell.target === targetSpell.target
					)
			)
		);
		if (!checkIfExists) {
			setSpellsWithoutBinds([
				...spellsWithoutBinds,
				{ ...targetSpell, key: null, mod: null },
			]);
		}
		setFinishedState(false);
	}

	function saveNewKeybinds() {
		setAllKeybindings(
			update(allKeybindings, {
				[keyBindingKey]: {
					$set: newKeybinds,
				},
			})
		);
		closeInAction();
	}

	function setNewCurrentSpell(newSpell, oldSpell) {
		//Problem:
		//we could have a situation like this
		//newSpell: Judgement target shift k
		//newKeybinds: [judgement target ctrl p, wings self shift k]
		//we need to "find" both of these as oldSpell, but only one will return, both need to
		//be removed with wings self being added back in and judgement target being discarded
		let tempNewKeybinds = [...newKeybinds];
		let addBackOld = false;
		if (oldSpell) {
			//find a spell with same KM - should ushally not exist- if exists add back to queue
			const spellWithSameKM = tempNewKeybinds.find(
				bind => bind.key === newSpell.key && bind.mod === newSpell.mod
			);

			//Filter out old spell
			tempNewKeybinds = tempNewKeybinds
				//Remove old spell
				.filter(
					bind =>
						!(
							bind.spellId === oldSpell.spellId &&
							bind.target === oldSpell.target
						)
				)
				//Try to remove anything that matches the newSpell
				.filter(
					bind =>
						!(
							bind.spellId === newSpell.spellId &&
							bind.target === newSpell.target
						)
				);
			//Removes any keybinding with same key/mod

			if (spellWithSameKM) {
				tempNewKeybinds = tempNewKeybinds.filter(
					bind =>
						!(
							bind.key === spellWithSameKM.key &&
							bind.mod === spellWithSameKM.mod
						)
				);
			}

			let isInSpellQueue = false;
			if (spellWithSameKM) {
				isInSpellQueue = spellsWithoutBinds.some(
					bind =>
						bind.spellId === spellWithSameKM.spellId &&
						bind.target === spellWithSameKM.target
				);
			}

			//can be true existing and new KBs
			const sameKM =
				newSpell.key === oldSpell.key && newSpell.mod === oldSpell.mod;
			//only existing KBs
			const sameST =
				newSpell.spellId === oldSpell.spellId &&
				newSpell.target === oldSpell.target;

			//Handling when a new keybind is replaced and added back to the queue
			if (sameKM && !isInSpellQueue && !sameST) {
				addBackOld = true;
			}
		}
		setNewKeybinds([...tempNewKeybinds, newSpell]);
		let newSpellsWithoutBinds = spellsWithoutBinds.filter(
			spell =>
				!(
					spell.spellId === newSpell.spellId &&
					spell.target === newSpell.target
				)
		);
		if (addBackOld) {
			newSpellsWithoutBinds = [
				...newSpellsWithoutBinds,
				{
					...oldSpell,
					key: null,
					mod: null,
				},
			];
		}
		setSpellsWithoutBinds(newSpellsWithoutBinds);
	}

	function turnOnMouseWheel() {
		setRefreshListener(!refreshListener);
	}

	function turnOffMouseWheel() {
		const el = document.querySelector('#rapid-fire-modal');
		el.onmousedown = null;
		el.onwheel = null;
	}

	return (
		<Fragment>
			<Grid container justify="space-between">
				<Grid item>
					<Button
						color="secondary"
						id="close-rapid-fire"
						variant="contained"
						onClick={closeInAction}
						size="large"
					>
						Cancel
					</Button>
				</Grid>
				{!finishedState && (
					<Grid item>
						<Button
							color="primary"
							variant="contained"
							size="large"
							//Deletes for now
							onClick={skipSpellBinding}
						>
							Skip
						</Button>
					</Grid>
				)}
				<Grid item>
					<Button
						color="primary"
						variant="contained"
						onClick={saveNewKeybinds}
						size="large"
					>
						Finish
					</Button>
				</Grid>
			</Grid>
			<hr style={{ borderTop: '3px solid #bbb' }} />

			{!finishedState && spellsWithoutBinds && currentSpell && (
				<RapidFireModalActionGame
					newKeybinds={newKeybinds}
					currentSpell={currentSpell}
					setNewCurrentSpell={setNewCurrentSpell}
					spellDetails={formattedSpells.find(
						spell => spell.spellId === currentSpell.spellId
					)}
					refreshListener={refreshListener}
				/>
			)}
			{!finishedState && <hr style={{ borderTop: '3px solid #bbb' }} />}
			<Tabs
				value={spellChangesView}
				onChange={(event, newValue) => setSpellChangesView(newValue)}
				textColor="primary"
				variant="fullWidth"
				scrollButtons="auto"
				aria-label="scrollable auto tabs example"
			>
				{newKeybinds && newKeybinds.length > 0 && (
					<Tab label="Incoming Spell Changes" {...a11yProps(1)} />
				)}
				{!finishedState && (
					<Tab label="Outgoing Spell Changes" {...a11yProps(2)} />
				)}
			</Tabs>
			<div
				onMouseEnter={turnOffMouseWheel}
				onMouseLeave={turnOnMouseWheel}
			>
				{newKeybinds && newKeybinds.length > 0 && (
					<TabPanel value={spellChangesView} index={0}>
						<KeybindTableRapidFire
							allKeybinds={newKeybinds}
							editing={true}
							editThisRow={redoKeybinding}
							finishedState={finishedState}
						/>{' '}
					</TabPanel>
				)}

				{!finishedState && (
					<TabPanel
						value={spellChangesView}
						index={newKeybinds && newKeybinds.length > 0 ? 1 : 0}
					>
						<KeybindTableRapidFire
							allKeybinds={spellsWithoutBinds}
							deleteThisRow={deleteSpell}
							editing={true}
						/>
					</TabPanel>
				)}
			</div>
		</Fragment>
	);
}

export default RapidFireModalAction;
