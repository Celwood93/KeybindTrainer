import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
	Tab,
	Tabs,
	AppBar,
	CircularProgress,
	Grid,
	Paper,
} from '@material-ui/core';
import '../../stylesheets/character.css';
import styleGuide from '../../stylesheets/style';
import { TabPanel, a11yProps } from './TabPanels';
import { ref, characterDetails } from '../../config/constants';

PropTypes.propTypes = {
	userId: PropTypes.string,
	match: PropTypes.obj,
};
function CharacterDetailPage({ userId, match, ...props }) {
	const [spec, setSpec] = useState(0);
	const [keyBinding, setKeybinding] = useState(0);
	const [loading, setLoading] = useState(true);
	const [character, setCharacter] = useState(0);
	const [description, setDescription] = useState();
	const [talents, setTalents] = useState();
	const [keyBinds, setKeybinds] = useState();
	const characterId = match.params && match.params.id;
	const fields =
		match.params && match.params.fields && JSON.parse(match.params.fields);

	useEffect(() => {
		async function collectCharacterInfo() {
			const path = `/Characters/${characterId}`;
			const snapShot = await ref.child(path).once('value');
			if (snapShot.exists()) {
				const charDetails = snapShot.val();
				setSpec(charDetails.selectedSpec);
				setCharacter(charDetails);
			}
			//Set something to say "character not found"
			setLoading(false);
		}
		if (!fields) {
			collectCharacterInfo();
		} else {
			//should be in a function
			//I think im doing alot of immutability violations here...
			const { name, characterClass, race } = fields;
			const selectedSpec = fields.spec;
			const specs = {};
			characterDetails.class[characterClass].forEach(spec => {
				specs[spec] = {
					configured: false,
				};
			});

			const newCharacter = {
				class: characterClass,
				race,
				selectedSpec,
				name,
				specs,
			};

			//this logic will probably be reused so make this into a function.
			const key = ref.child('/Keybindings').push().key;
			newCharacter.specs[
				characterDetails.class[characterClass][selectedSpec]
			]['selectedKeybindings'] = key;
			newCharacter.specs[
				characterDetails.class[characterClass][selectedSpec]
			]['keybindings'] = {
				[key]: {
					description: '',
					talents: { 1: 1, 2: 2, 3: 3 }, //placeholder for now
				},
			};
			console.log(newCharacter);
			setSpec(selectedSpec);
			setCharacter(newCharacter);
			setLoading(false);
		}
	}, []);

	const handleSpecChange = (event, newSpec) => {
		//here i also need to know which keybinding to call, can use current spec
		setSpec(newSpec);
	};
	const handleKeybindingsChange = (event, newKeybindings) => {
		//this is where i want to call for a new call for the keybindings -> need some one to know which
		setKeybinding(newKeybindings);
	};

	function makeNewKeybindings() {
		const key = ref.child('/Keybindings').push().key;
		if (
			!character.specs[characterDetails.class[character.class][spec]]
				.keybindings
		) {
			character.specs[characterDetails.class[character.class][spec]][
				'selectedKeybindings'
			] = key;
			character.specs[characterDetails.class[character.class][spec]][
				'keybindings'
			] = {
				[key]: {
					description: '',
					talents: { 1: 1, 2: 2, 3: 3 }, //placeholder for now
				},
			};
		}
		character.specs[
			characterDetails.class[character.class][spec]
		].keybindings[key] = {
			description: '',
			talents: { 1: 1, 2: 2, 3: 3 }, //placeholder for now
		};
		//these will NOT have the actual keybindings, those are retrieved when switching keybindings, with a loadbar on the dropdown if the dropdown is clicked.
		//or when switching specs. This also means i need to cancel requests if i switch specs or keybindings.
		//this is where configured will come into play, since technically you only need 1 keybinding to do anything, it just needs to be activated.
		setCharacter({ ...character });
	}

	return !loading ? (
		<React.Fragment>
			<div style={{ marginLeft: '1rem', marginRight: '1rem' }}>
				<div style={{ paddingLeft: '5rem', textAlign: 'left' }}>
					{character.name}
				</div>
				<div className={styleGuide.tabRoot}>
					<AppBar position="static" color="default">
						<Tabs
							//also should be an easier way to do this... this is insane
							value={spec}
							onChange={handleSpecChange}
							textColor="primary"
							variant="fullWidth"
							scrollButtons="auto"
							aria-label="scrollable auto tabs example"
						>
							{characterDetails.class[character.class].map(
								spec => {
									return (
										<Tab
											label={spec}
											key={spec}
											{...a11yProps(spec)}
										/>
									);
								}
							)}
						</Tabs>
					</AppBar>
					<AppBar position="static">
						<Tabs
							value={keyBinding}
							onChange={handleKeybindingsChange}
							variant="scrollable"
							scrollButtons="auto"
							aria-label="nav tabs example"
						>
							{character.specs[
								characterDetails.class[character.class][spec]
							].keybindings &&
								Object.keys(
									character.specs[
										characterDetails.class[character.class][
											spec
										]
									].keybindings
								).map((val, index) => {
									const tabLabel = `Keybindings-${index + 1}`;
									return (
										<Tab
											label={tabLabel}
											key={val}
											{...a11yProps(val)}
										/>
									);
								})}
							<Tab
								onClick={() => makeNewKeybindings()}
								label="Create New Keybindings"
							/>
						</Tabs>
					</AppBar>
					{//So, you create a new character, then you go to your character page. you then hit create new keybindings
					//if no keybindings exist yet then there is a thing HERE that says "click create new keybiindings to get started!"
					character.specs[
						characterDetails.class[character.class][spec]
					].keybindings ? (
						Object.keys(
							character.specs[
								characterDetails.class[character.class][spec]
							].keybindings
						).map((val, index) => {
							console.log(val);
							return (
								<TabPanel
									value={keyBinding}
									key={val}
									index={index}
								>
									<Grid container spacing={1}>
										<Grid container direction="row">
											<Grid item>
												<Paper>Description</Paper>
											</Grid>
										</Grid>
										<Grid container direction="row">
											<Grid item>
												<Paper>Talents</Paper>
											</Grid>
										</Grid>
										<Grid container direction="row">
											<Grid item>
												<Paper>Keybindings</Paper>
											</Grid>
										</Grid>
									</Grid>
								</TabPanel>
							);
						})
					) : (
						<div>
							Click 'Create new keybindings' to get started!
						</div>
					)}
				</div>
			</div>
		</React.Fragment>
	) : (
		<CircularProgress />
	);
}

export default CharacterDetailPage;
