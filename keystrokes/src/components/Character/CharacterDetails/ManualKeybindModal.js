import React, { useState } from 'react';
import { Modal, Button, Grid, TextField, MenuItem } from '@material-ui/core';
import PropTypes from 'prop-types';
import styleGuide from '../../../stylesheets/style';

ManualKeybindModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};

function ManualKeybindModal({ isOpen, setIsOpen }) {
	const classes = styleGuide();
	const [keybinding, setKeybinding] = useState({
		Spell: null,
		Target: null,
		Mod: null,
		Key: null,
	});

	return (
		<Modal open={isOpen} onClose={() => {}} className={classes.modal}>
			<div className={classes.manualModalBackground}>
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
					{['Spell', 'Target', 'Mod'].map(type => (
						<Grid
							item
							key={type}
							className={classes.keybindingOptions}
						>
							<TextField
								className={classes.button}
								select
								variant="outlined"
								value=""
								label={type}
								onChange={() => {}}
							>
								{['the creeping dead', 2, 3].map(option => (
									<MenuItem key={option} value={option}>
										{option}
									</MenuItem>
								))}
							</TextField>
						</Grid>
					))}
					<Grid item className={classes.keybindingOptions}>
						<Button
							className={classes.button}
							color="primary"
							variant="contained"
							size="large"
						>
							Key
						</Button>
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
			</div>
		</Modal>
	);
}

export default ManualKeybindModal;
