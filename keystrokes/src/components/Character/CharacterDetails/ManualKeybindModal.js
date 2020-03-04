import React, { useState, useEffect } from 'react';
import { Modal, Button, Grid, TextField, MenuItem } from '@material-ui/core';
import PropTypes from 'prop-types';
import styleGuide from '../../../stylesheets/style';
import {
	ref,
	targetting,
	mods,
	characterDetails,
} from '../../../config/constants';

ManualKeybindModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};

function ManualKeybindModal({
	isOpen,
	setIsOpen,
	characterClass,
	characterSpec,
}) {
	const classes = styleGuide();
	const [keybinding, setKeybinding] = useState({
		Spell: null,
		Target: null,
		Mod: null,
		Key: null,
	});
	const [loading, setLoading] = useState(true);
	const [Spells, setSpells] = useState();
	const [errors, setErrors] = useState();
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
									error={!!errors}
									helperText={errors}
									onChange={event => {
										const newKey = event.target.value
											.toLowerCase()
											.slice(-1);
										if (
											!newKey.match(
												/^[a-z0-9`\-=\[\]\\;',\.\/ ]?$/
											)
										) {
											setErrors(
												'only valid characters, no shift ones'
											);
										} else {
											setErrors('');
										}
										//issues here since we cant tell if it is being pressed by shift or not for things like ` or ~
										setKeybinding({
											...keybinding,
											Key: newKey,
										});
									}}
								/>
							</Grid>
							<Grid item className={classes.keybindingOptions}>
								<Button
									className={classes.button}
									color="primary"
									disabled={!!errors}
									variant="contained"
									size="large"
									onClick={() => {
										console.log(keybinding);
									}}
								>
									Enter
								</Button>
							</Grid>
						</Grid>
					</React.Fragment>
				)}
			</div>
		</Modal>
	);
}

export default ManualKeybindModal;
