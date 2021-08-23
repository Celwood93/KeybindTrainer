import React, { useState, useEffect } from 'react';
import { Modal, Button, Grid, Snackbar, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { Alert, alerter } from './Alert';
import styleGuide from '../../stylesheets/style';
import { ref } from '../../config/constants';

UnsavedCharacterModal.propTypes = {
	userId: PropTypes.string,
};
function UnsavedCharacterModal({ userId }) {
	const classes = styleGuide();
	const [isOpen, setIsOpen] = useState(false);
	const [alert, setAlert] = alerter();

	function getObjectDiff(obj1, obj2) {
		const diff = Object.keys(obj1).reduce((result, key) => {
			if (!obj2.hasOwnProperty(key)) {
				result.push(key);
			} else if (isEqual(obj1[key], obj2[key])) {
				const resultKeyIndex = result.indexOf(key);
				result.splice(resultKeyIndex, 1);
			}
			return result;
		}, Object.keys(obj2));

		return diff;
	}

	useEffect(() => {
		const localStorage = window.localStorage;
		if ('backup' in localStorage) {
			const backup = JSON.parse(localStorage.getItem('backup'));
			if (
				backup.userId === userId &&
				(!isEqual(backup.fromDB.character, backup.updated.character) ||
					!isEqual(
						backup.fromDB.keybindings,
						backup.updated.keybindings
					))
			) {
				setIsOpen(true);
				if (
					backup &&
					backup.fromDB &&
					backup.updated &&
					backup.fromDB.keybindings &&
					backup.updated.keybindings
				) {
					console.log(
						getObjectDiff(
							backup.fromDB.keybindings,
							backup.updated.keybindings
						)
					);
				}
			} else {
				localStorage.removeItem('backup');
			}
		}
	});

	function discardChanges() {
		const localStorage = window.localStorage;
		localStorage.removeItem('backup');
		setIsOpen(false);
	}

	async function saveChanges() {
		const localStorage = window.localStorage;
		const backup = JSON.parse(localStorage.getItem('backup'));
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
			localStorage.removeItem('backup');
			setAlertMessage(res);
		} catch (e) {
			console.error('error saving character updates');
		}
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
		const localStorage = window.localStorage;
		const backup = localStorage.getItem('backup');
		let backupState;
		if (backup) {
			backupState = JSON.parse(backup);
			return `Unsaved changes with ${
				backupState.updated.character.name
			} in ${
				isEqual(
					backupState.fromDB.character,
					backupState.updated.character
				)
					? ''
					: 'Character Details'
			} ${
				!isEqual(
					backupState.fromDB.character,
					backupState.updated.character
				) &&
				!isEqual(
					backupState.fromDB.keybindings,
					backupState.updated.keybindings
				)
					? ' and '
					: ''
			} ${
				isEqual(
					backupState.fromDB.keybindings,
					backupState.updated.keybindings
				)
					? ''
					: 'Keybindings'
			}`;
		} else {
			return '';
		}
	}

	return (
		<Modal open={isOpen} onClose={() => {}} className={classes.modal}>
			<div className={classes.unsavedCharacterModalBackground}>
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
