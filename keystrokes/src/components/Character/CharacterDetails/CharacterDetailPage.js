import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CircularProgress, Grid, Button, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
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
	const [alert, setAlert] = useState({
		open: false,
		message: 'placeholder',
		type: 'placeholder',
	});
	const [character, setCharacter] = useState(0);
	const [allKeybindings, setAllKeybindings] = useState({});
	const classes = styleGuide();
	const characterId = match.params && match.params.id;
	const fields =
		match.params && match.params.fields && JSON.parse(match.params.fields);

	function Alert(props) {
		return <MuiAlert elevation={6} variant="filled" {...props} />;
	}

	useEffect(() => {
		async function collectCharacterInfo() {
			const path = `/Characters/${characterId}`;
			const snapShot = await ref.child(path).once('value');
			if (snapShot.exists()) {
				const charDetails = snapShot.val();
				setCharacter(charDetails);
			}
			//Set something to say "character not found"
			setLoading(false);
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
		//TODO remove placeholder
		setAllKeybindings({ ...allKeybindings, [key]: [] });
		// we then need to pass in AllKeybindings... all the way through.
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

		const error = await ref.update(updates);
		if (error) {
			//could specify the error in here, if i knew what it was....
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

	function selectCharacter() {
		console.log('Work In Progress');
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
					/>
				</div>
			</div>
		</React.Fragment>
	) : (
		<CircularProgress />
	);
}

export default CharacterDetailPage;
