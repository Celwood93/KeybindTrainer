import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CircularProgress, Grid, Button, Snackbar } from '@material-ui/core';
import { Alert, alerter } from '../../utils/Alert';
import update from 'immutability-helper';
import styleGuide from '../../../stylesheets/style';
import { ref } from '../../../config/constants';
import CharacterSpecNavigation from './CharacterSpecNavigation';
import { Character, Spec } from '../../Factories/CharacterFactories';

CharacterDetailPage.propTypes = {
	userId: PropTypes.string,
	match: PropTypes.object,
};
function CharacterDetailPage({ userId, match }) {
	const [loading, setLoading] = useState(true);
	const [alert, setAlert] = alerter();
	const [character, setCharacter] = useState(0);
	const [allKeybindings, setAllKeybindings] = useState({});
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
					setCharacter(charDetails);
				}
				//Set something to say "character not found"
				setLoading(false);
			} catch (e) {
				console.error(`failed to collect value from ${path}`);
			}
		}
		if (!fields) {
			collectCharacterInfo();
		} else {
			newKeybindings(fields.spec, Character(fields));
			setLoading(false);
		}
	}, []);

	function newKeybindings(spec, char) {
		const key = ref.child('/Keybindings').push().key;
		setAllKeybindings({ ...allKeybindings, [key]: [] });
		setCharacter(
			update(char, {
				specs: { [spec]: { $set: Spec(char.specs[spec], key) } },
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
			const error = await ref.update(updates);
			setAlertMessage(error);
		} catch (e) {
			console.error('error saving character updates');
		}
	}

	async function selectCharacter() {
		let updates = {};
		updates[`/Users/${userId}/selectedCharacter`] = characterId;
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
						<Button
							variant="contained"
							disabled={
								!character.specs[character.selectedSpec]
									.configured
							}
							className={classes.bottomMarginNegTwo}
							onClick={selectCharacter}
						>
							Select
						</Button>
						<Button
							variant="contained"
							color="secondary"
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
					/>
				</div>
			</div>
		</React.Fragment>
	) : (
		<CircularProgress />
	);
}

export default CharacterDetailPage;
