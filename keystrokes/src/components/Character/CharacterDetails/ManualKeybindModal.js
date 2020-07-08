import React, { useState, useEffect } from 'react';
import { Modal, Button, Grid, TextField, MenuItem } from '@material-ui/core';
import update from 'immutability-helper';
import PropTypes from 'prop-types';
import KeybindTable from './KeybindTable';
import styleGuide from '../../../stylesheets/style';
import { verifyKey, validatePress } from '../../utils/utils';
import {
	ref,
	targetting,
	mods,
	characterDetails,
} from '../../../config/constants';

ManualKeybindModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
	characterClass: PropTypes.string.isRequired,
	characterSpec: PropTypes.number.isRequired,
	setAllKeybindings: PropTypes.func.isRequired,
	allKeybindings: PropTypes.object.isRequired,
	keyBindingKey: PropTypes.string.isRequired,
};

function ManualKeybindModal({
	isOpen,
	setIsOpen,
	characterClass,
	characterSpec,
	setAllKeybindings,
	allKeybindings,
	keyBindingKey,
}) {
	const classes = styleGuide();
	const [keybinding, setKeybinding] = useState({
		Spell: null,
		Target: null,
		Mod: null,
		Key: null,
	});
	const [allKeybinds, setAllKeybinds] = useState([]);
	const [loading, setLoading] = useState(true);
	const [Spells, setSpells] = useState();
	const spec = characterDetails.class[characterClass][
		characterSpec
	].toUpperCase();

	useEffect(() => {
		async function getSpells() {
			const path = `/Spells/${characterClass}`;
			const snapShot = await ref.child(path).once('value');
			if (snapShot.exists()) {
				setSpells(snapShot.val());
				setLoading(false);
			}
		}
		getSpells();
	}, []);

	function handleKeyPress(e) {
		if (!e.metaKey) {
			e.preventDefault();
		}
		const newKey = e.code.toLowerCase().replace(/digit|key/i, '');
		if (validatePress(newKey)) {
			setKeybinding({
				...keybinding,
				Key: verifyKey(newKey),
			});
		} else if (newKey === 'backspace' || newKey === 'delete') {
			setKeybinding({
				...keybinding,
				Key: '',
			});
		}
	}

	return (
		<Modal open={isOpen} onClose={() => {}} className={classes.modal}>
			<div className={classes.manualModalBackground}>
				{loading ? (
					<div>Loading</div>
				) : (
					<React.Fragment>
						<Grid container justify="space-between">
							<Grid item>
								<Button
									color="secondary"
									variant="contained"
									onClick={() => {
										setAllKeybinds([]);
										setIsOpen(false);
									}}
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
									onClick={() => {
										setAllKeybindings(
											update(allKeybindings, {
												[keyBindingKey]: {
													$push: allKeybinds,
												},
											})
										);
										setAllKeybinds([]);
										setIsOpen(false);
									}}
								>
									Finish
								</Button>
							</Grid>
						</Grid>
						<Grid
							container
							className={classes.paddingTop}
							justify="center"
							alignItems="center"
						>
							<Grid item className={classes.keybindingOptions}>
								<TextField
									className={classes.button}
									select
									variant="outlined"
									value={keybinding.Spell || ''}
									label={'Spell'}
									onChange={event => {
										setKeybinding({
											...keybinding,
											Spell: event.target.value,
										});
									}}
								>
									{Object.entries(Spells)
										.filter((spell, index) => {
											return spell[1].spec.includes(spec);
										})
										.map((spell, index) => (
											<MenuItem
												key={spell[0]}
												value={spell[0]}
											>
												{spell[0]}
											</MenuItem>
										))}
								</TextField>
							</Grid>
							<Grid item className={classes.keybindingOptions}>
								<TextField
									className={classes.button}
									select={!!keybinding.Spell}
									disabled={!keybinding.Spell}
									variant="outlined"
									value={keybinding.Target || ''}
									label={'Target'}
									onChange={event => {
										setKeybinding({
											...keybinding,
											Target: event.target.value,
										});
									}}
								>
									{keybinding.Spell &&
										targetting[
											Spells[keybinding.Spell].targetType
										].map(option => (
											<MenuItem
												key={option}
												value={option}
											>
												{option}
											</MenuItem>
										))}
								</TextField>
							</Grid>
							<Grid item className={classes.keybindingOptions}>
								<TextField
									className={classes.button}
									select
									disabled={!keybinding.Spell}
									variant="outlined"
									value={keybinding.Mod || ''}
									label={'Mod'}
									onChange={event => {
										setKeybinding({
											...keybinding,
											Mod: event.target.value,
										});
									}}
								>
									{mods.map(option => (
										<MenuItem key={option} value={option}>
											{option}
										</MenuItem>
									))}
								</TextField>
							</Grid>
							<Grid item className={classes.keybindingOptions}>
								<TextField
									className={classes.button}
									disabled={!keybinding.Spell}
									variant="outlined"
									value={keybinding.Key || ''}
									label={'Key'}
									onFocus={() => {
										document.body.onkeydown = handleKeyPress;
									}}
									onBlur={() => {
										document.body.onkeydown = null;
									}}
								/>
							</Grid>
							<Grid item className={classes.keybindingOptions}>
								<Button
									className={classes.button}
									color="primary"
									disabled={false} //make this so everything has to be non-null
									variant="contained"
									size="large"
									onClick={() => {
										setAllKeybinds([
											keybinding,
											...allKeybinds,
										]);
										setKeybinding({
											Spell: null,
											Target: null,
											Mod: null,
											Key: null,
										});
									}}
								>
									Enter
								</Button>
							</Grid>
						</Grid>
						<KeybindTable allKeybinds={allKeybinds} />
					</React.Fragment>
				)}
			</div>
		</Modal>
	);
}

export default ManualKeybindModal;
