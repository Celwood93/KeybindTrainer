import React, { useState, useEffect } from 'react';
import { Modal, Button, Grid, TextField, MenuItem } from '@material-ui/core';
import PropTypes from 'prop-types';
import styleGuide from '../../../stylesheets/style';
import { ref } from '../../../config/constants';

ManualKeybindModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};

function ManualKeybindModal({ isOpen, setIsOpen, characterClass }) {
	const classes = styleGuide();
	const [keybinding, setKeybinding] = useState({
		Spell: null,
		Target: null,
		Mod: null,
		Key: null,
	});
	const [loading, setLoading] = useState(true);
	const [Spells, setSpells] = useState();
	let options = {
		Target: [
			'Self',
			'Arena1',
			'Arena2',
			'Arena3',
			'Party1',
			'Party2',
			'Party3',
		],
		Mod: ['Shift', 'Ctrl', 'Alt', 'None'],
	};

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
									{Object.keys(Spells).map(option => (
										<MenuItem key={option} value={option}>
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
									value={keybinding.Target || ''}
									label={'Target'}
									onChange={event => {
										setKeybinding({
											...keybinding,
											Target: event.target.value,
										});
									}}
								>
									{options.Target.filter(targ => {}).map(
										option => (
											<MenuItem
												key={option}
												value={option}
											>
												{option}
											</MenuItem>
										)
									)}
								</TextField>
							</Grid>
							<Grid item className={classes.keybindingOptions}>
								<TextField
									className={classes.button}
									style={
										keybinding.Mod === 'Ctrl'
											? { marginTop: '31px' }
											: {}
									}
									select
									disabled={!keybinding.Spell}
									variant="outlined"
									// helperText={
									// 	keybinding.Mod === 'Ctrl' ? (
									// 		<div style={{ color: 'red' }}>
									// 			Be careful, command ctrl + w
									// 			will still work
									// 		</div>
									// 	) : (
									// 		''
									// 	)
									// }
									value={keybinding.Mod || ''}
									label={'Mod'}
									onChange={event => {
										setKeybinding({
											...keybinding,
											Mod: event.target.value,
										});
									}}
								>
									{options.Mod.map(option => (
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
									onChange={event => {
										//issues here since we cant tell if it is being pressed by shift or not for things like ` or ~
										setKeybinding({
											...keybinding,
											Key: event.target.value
												.toLowerCase()
												.slice(-1),
										});
									}}
								/>
							</Grid>
							<Grid item className={classes.keybindingOptions}>
								<Button
									className={classes.button}
									color="primary"
									variant="contained"
									size="large"
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
