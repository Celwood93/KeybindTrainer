import React, { useState, useEffect, Fragment } from 'react';
import { Grid, Typography, Tooltip, Button } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import { targettingDetails, targetting } from '../../../config/constants';
import update from 'immutability-helper';
import PropTypes from 'prop-types';
import DetailedDropdownConfig from './DetailedDropdownConfig';
import RapidFireModalActionGame from './RapidFireModalActionGame';

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
	setAllKeybindings,
	allKeybindings,
	keyBindingKey,
	closeInAction,
}) {
	const [spellsWithoutBinds, setSpellsWithoutBinds] = useState();
	const [newKeybinds, setNewKeybinds] = useState(
		allKeybindings[keyBindingKey]
	);
	const [currentSpell, setCurrentSpell] = useState();
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
				saveNewKeybinds();
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

	return (
		<Fragment>
			<Grid container justify="space-between">
				<Grid item>
					<Button
						color="secondary"
						variant="contained"
						onClick={closeInAction}
						size="large"
					>
						Cancel
					</Button>
				</Grid>
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
			{spellsWithoutBinds && currentSpell && (
				<RapidFireModalActionGame
					newKeybinds={newKeybinds}
					currentSpell={currentSpell}
					setNewCurrentSpell={setNewCurrentSpell}
					spellDetails={formattedSpells.find(
						spell => spell.spellId === currentSpell.spellId
					)}
				/>
			)}
		</Fragment>
	);
}

export default RapidFireModalAction;
