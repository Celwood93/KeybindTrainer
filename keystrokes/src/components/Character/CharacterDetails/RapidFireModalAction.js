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
			const numSpells =
				newKeybinds.length - allKeybindings[keyBindingKey].length;
			if (numSpells > spellsWithoutBinds.length) {
				//save to db and shit or whatever
			} else {
				setCurrentSpell(spellsWithoutBinds[numSpells]);
			}
		}
	}, [newKeybinds, spellsWithoutBinds]);

	function setNewCurrentSpell(newSpell, oldSpell) {
		let tempNewKeybinds = [...newKeybinds];
		debugger;
		if (oldSpell) {
			tempNewKeybinds = newKeybinds.filter(
				bind =>
					!(
						bind.spellId === oldSpell.spellId &&
						bind.target === oldSpell.target
					)
			);
			if (
				!(
					newSpell.spellId === oldSpell.spellId &&
					newSpell.target === oldSpell.target
				)
			) {
				setSpellsWithoutBinds([
					...spellsWithoutBinds,
					{
						...oldSpell,
						key: null,
						mod: null,
					},
				]);
			}
		}
		setNewKeybinds([...tempNewKeybinds, newSpell]);
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
						onClick={() => {}}
					>
						Skip
					</Button>
				</Grid>
				<Grid item>
					<Button
						color="primary"
						variant="contained"
						onClick={() => {}}
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
