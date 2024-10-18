import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Grid, Snackbar, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { Alert, alerter } from './Alert';
import styleGuide from '../../stylesheets/style';
import { ref } from '../../config/constants';
import { useLocation } from 'react-router';

UnsavedCharacterModal.propTypes = {
	userId: PropTypes.string,
};
function UnsavedCharacterModal({ userId }) {
	const classes = styleGuide();
	const [isOpen, setIsOpen] = useState(false);
	const [alert, setAlert] = alerter();
	const [backup, setBackup] = useState();
	const location = useLocation();

	useEffect(() => {
		const localStorage = window.localStorage;
		if ('backup' in localStorage) {
			const backupLs = JSON.parse(localStorage.getItem('backup'));
			if (
				backupLs.userId === userId &&
				(!isEqual(
					backupLs.fromDB.character,
					backupLs.updated.character
				) ||
					!isEqual(
						backupLs.fromDB.keybindings,
						backupLs.updated.keybindings
					))
			) {
				setIsOpen(true);
				if (!backup) {
					setBackup(backupLs);
				}
			} else {
				localStorage.removeItem('backup');
			}
		}
	}, [location]);

	function discardChanges() {
		const localStorage = window.localStorage;
		const backupLs = JSON.parse(localStorage.getItem('backup'));
		if (isEqual(backupLs, backup)) {
			localStorage.removeItem('backup');
		}
		setBackup(null);
		setIsOpen(false);
	}

	async function saveChanges() {
		const localStorage = window.localStorage;
		const backupLs = JSON.parse(localStorage.getItem('backup'));
		let updates = {};
		updates[`/Characters/${backup.characterId}`] = backup.updated.character;
		updates[`/Users/${backup.userId}/characters/${backup.characterId}`] = {
			name: backup.updated.character.name,
		};
		if (backup.updated.keybindings) {
			Object.keys(backup.updated.keybindings).forEach(key => {
				updates[`/Keybindings/${key}`] =
					backup.updated.keybindings[key];
			});
		}
		try {
			const res = await ref.update(updates);
			if (isEqual(backupLs, backup)) {
				localStorage.removeItem('backup');
			}
			setAlertMessage(res);
		} catch (e) {
			console.log(e);
			console.error('error saving character updates');
		}
		setBackup(null);
		setIsOpen(false);
	}

	function setAlertMessage(error) {
		if (error) {
			setAlert({
				open: true,
				message: 'Failed to save',
				type: 'error',
			});
		} else {
			setAlert({
				open: true,
				message: 'Saved successfully!',
				type: 'success',
			});
		}
	}

	function generateText() {
		if (backup) {
			return `Unsaved changes with ${backup.updated.character.name} in ${
				isEqual(backup.fromDB.character, backup.updated.character)
					? ''
					: 'Character Details'
			} ${
				!isEqual(backup.fromDB.character, backup.updated.character) &&
				!isEqual(backup.fromDB.keybindings, backup.updated.keybindings)
					? ' and '
					: ''
			} ${
				isEqual(backup.fromDB.keybindings, backup.updated.keybindings)
					? ''
					: 'Keybindings'
			}`;
		} else {
			return '';
		}
	}

	return (
		<Modal open={isOpen} onClose={() => {}} className={classes.modal}>
			<div
				className={classes.unsavedCharacterModalBackground}
				id="unsavedCharacterModal"
			>
				<Snackbar
					open={alert.open}
					onClose={() => setAlert({ ...alert, open: false })}
					autoHideDuration={2000}
				>
					<Alert
						onClose={() => setAlert({ ...alert, open: false })}
						severity={alert.type}
					>
						{alert.message}
					</Alert>
				</Snackbar>
				<React.Fragment>
					<Typography align="center" variant="h6">
						{generateText()}
					</Typography>
					<Grid container justify="space-between">
						<Grid item>
							<Button
								color="secondary"
								variant="contained"
								id="unsavedModalDiscardButton"
								onClick={discardChanges}
								size="large"
							>
								Discard
							</Button>
						</Grid>
						<Grid item>
							<Button
								color="primary"
								variant="contained"
								id="unsavedModalSaveButton"
								size="large"
								onClick={saveChanges}
							>
								Save
							</Button>
						</Grid>
					</Grid>
				</React.Fragment>
			</div>
		</Modal>
	);
}

export default UnsavedCharacterModal;
