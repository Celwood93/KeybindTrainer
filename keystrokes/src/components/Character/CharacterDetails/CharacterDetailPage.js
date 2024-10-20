import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
	CircularProgress,
	Grid,
	Button,
	Snackbar,
	Tooltip,
} from '@material-ui/core';
import { Alert, alerter } from '../../utils/Alert';
import update from 'immutability-helper';
import styleGuide from '../../../stylesheets/style';
import { ref } from '../../../config/constants';
import CharacterSpecNavigation from './CharacterSpecNavigation';
import { Character, Spec } from '../../Factories/CharacterFactories';
import { characterKeybindings } from '../../utils/utils';
import { enableToolTips } from '../../utils/toolTipHooks';

CharacterDetailPage.propTypes = {
	userId: PropTypes.string,
	match: PropTypes.object,
};
function CharacterDetailPage({ userId, match }) {
	const [loading, setLoading] = useState(true);
	const [isSaved, setIsSaved] = useState(false);
	const [alert, setAlert] = alerter();
	const [character, setTheCharacter] = useState(0);
	const [allKeybindings, setAllTheKeybindings] = useState({});
	const [keyBinding, setKeybinding] = useState();
	const [spec, setSpec] = useState();
	const classes = styleGuide();
	const characterId = match.params && match.params.id;
	const fields =
		match.params && match.params.fields && JSON.parse(match.params.fields);

	useEffect(() => {
		async function collectCharacterInfo() {
			const path = `/Characters/${characterId}`;
			try {
				const snapShot = await ref.child(path).once('value');
				if (snapShot.exists()) {
					const charDetails = snapShot.val();
					window.localStorage.setItem(
						'backup',
						JSON.stringify({
							characterId: characterId,
							userId: userId,
							fromDB: {
								character: charDetails,
							},
							updated: {
								character: charDetails,
								keybindings: {},
							},
						})
					);
					setKeybinding(
						charDetails.specs[charDetails.selectedSpec]
							.selectedKeybindings
					);
					setSpec(charDetails.selectedSpec);
					setCharacter(charDetails);
					setIsSaved(true);
				}
				//Set something to say "character not found"
				setLoading(false);
			} catch (e) {
				console.error(`failed to collect value from ${path}`);
				//TODO use alert to show it failed
			}
		}
		if (!fields) {
			collectCharacterInfo();
		} else {
			newKeybindings(fields.spec, Character(fields), {
				characterId: characterId,
				userId: userId,
				fromDB: {
					character: {},
				},
				updated: {
					character: {},
				},
			});
			setLoading(false);
		}
	}, []);

	enableToolTips();

	function setCharacter(newCharacter) {
		setTheCharacter(newCharacter);
		const backupChar = JSON.parse(window.localStorage.getItem('backup'));
		if (backupChar) {
			backupChar.updated.character = newCharacter;
			window.localStorage.setItem('backup', JSON.stringify(backupChar));
		}
	}
	function setAllKeybindings(newKeybindings, backup = {}) {
		setAllTheKeybindings(newKeybindings);
		let backupKeybindings = JSON.parse(
			window.localStorage.getItem('backup')
		);
		if (!backupKeybindings) {
			backupKeybindings = backup;
		}
		if (backupKeybindings.updated) {
			backupKeybindings.updated.keybindings = newKeybindings;
			window.localStorage.setItem(
				'backup',
				JSON.stringify(backupKeybindings)
			);
		}
	}

	function newKeybindings(spec, char, backup = {}) {
		const key = ref.child('/Keybindings').push().key;
		setAllKeybindings({ ...allKeybindings, [key]: [] }, backup);
		setSpec(spec);
		setKeybinding(
			(char.specs[spec] &&
				char.specs[spec].keybindings &&
				char.specs[spec].keybindings.length) ||
				0
		);
		setCharacter(
			update(char, {
				specs: { [spec]: { $set: Spec(char.specs[spec] || {}, key) } },
			})
		);
	}

	async function saveCharacter() {
		let updates = {};
		updates[`/Characters/${characterId}`] = character;
		updates[`/Users/${userId}/characters/${characterId}`] = {
			name: character.name,
		};
		if (allKeybindings) {
			Object.keys(allKeybindings).forEach(key => {
				updates[`/Keybindings/${key}`] = allKeybindings[key];
			});
		}
		try {
			window.localStorage.setItem(
				'backup',
				JSON.stringify({
					characterId: characterId,
					userId: userId,
					fromDB: {
						character: character,
						keybindings: allKeybindings,
					},
					updated: {
						character: character,
						keybindings: allKeybindings,
					},
				})
			);
			const res = await ref.update(updates);
			setAlertMessage(res);
			setIsSaved(true);
		} catch (e) {
			console.error('error saving character updates');
		}
	}

	async function selectCharacter() {
		let updates = {};
		updates[`/Users/${userId}/selectedCharacter`] = characterId;
		updates[`/Characters/${characterId}/selectedSpec`] = spec;
		updates[
			`/Characters/${characterId}/specs/${character.selectedSpec}/selectedKeybindings`
		] = keyBinding;
		try {
			const error = await ref.update(updates);
			setAlertMessage(error);
		} catch (e) {
			console.error('failed to update character');
		}
	}

	function setAlertMessage(error) {
		if (error) {
			//TODO specify error
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

	function checkIfValidSelect() {
		return !(
			isSaved &&
			character.specs[spec] &&
			allKeybindings[characterKeybindings(character, spec, keyBinding)] &&
			allKeybindings[
				characterKeybindings(character, spec, keyBinding)
			].filter(bind => !bind.disabled).length > 0
		);
	}

	return !loading ? (
		<React.Fragment>
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
			<div className={classes.detailPageContainer}>
				<Grid
					container
					direction="row"
					justify="space-between"
					alignItems="flex-end"
				>
					<Grid item className={classes.marginLeftTwoRem}>
						{character.name}
					</Grid>
					<Grid item>
						<Tooltip
							title={
								'Enter keybindings by clicking edit, then manual for a given layout and spec, then save it to select for gameplay!'
							}
						>
							<span>
								<Button
									variant="contained"
									disabled={checkIfValidSelect()}
									id="select-character"
									className={classes.bottomMarginNegTwo}
									onClick={selectCharacter}
								>
									Select
								</Button>
							</span>
						</Tooltip>
						<Button
							variant="contained"
							color="secondary"
							id="save-character-changes"
							onClick={saveCharacter}
							className={classes.bottomMarginNegTwo}
						>
							SAVE
						</Button>
					</Grid>
				</Grid>
				<div className={classes.tabRoot}>
					<CharacterSpecNavigation
						character={character}
						setCharacter={setCharacter}
						makeNewKeybindings={newKeybindings}
						allKeybindings={allKeybindings}
						setAllKeybindings={setAllKeybindings}
						createNewKeybinding={newKeybindings}
						keyBinding={keyBinding}
						setKeybinding={setKeybinding}
						spec={spec}
						setSpec={setSpec}
					/>
				</div>
			</div>
		</React.Fragment>
	) : (
		<CircularProgress />
	);
}

export default CharacterDetailPage;
