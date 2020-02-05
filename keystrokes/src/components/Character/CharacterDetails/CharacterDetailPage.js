import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
	Tab,
	Tabs,
	AppBar,
	CircularProgress,
	Grid,
	Button,
	Typography,
	Paper,
	ExpansionPanel,
	ExpansionPanelSummary,
	ExpansionPanelDetails,
	Snackbar,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styleGuide from '../../../stylesheets/style';
import { TabPanel, a11yProps } from '../helpers/TabPanels';
import { ref, characterDetails } from '../../../config/constants';

PropTypes.propTypes = {
	userId: PropTypes.string,
	match: PropTypes.obj,
};
function CharacterDetailPage({ userId, match, ...props }) {
	const [spec, setSpec] = useState(0);
	const [keyBinding, setKeybinding] = useState(0);
	const [loading, setLoading] = useState(true);
	const [alert, setAlert] = useState({
		open: false,
		message: 'placeholder',
		type: 'placeholder',
	});
	const [character, setCharacter] = useState(0);
	const [description, setDescription] = useState();
	const [talents, setTalents] = useState();
	const [allKeybindings, setAllKeybindings] = useState();
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
				setSpec(charDetails.selectedSpec);
				setCharacter(charDetails);
			}
			//Set something to say "character not found"
			//need to add abunch more shit based on stored data.
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
			characterDetails.class[characterClass].forEach((spec, index) => {
				specs[index] = {
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
			setAllKeybindings({ ...allKeybindings, [key]: { hello: 'there' } });
			newCharacter.specs[selectedSpec]['selectedKeybindings'] = key;
			newCharacter.specs[selectedSpec]['keybindings'] = {
				[key]: {
					description: '',
					talents: { 1: 1, 2: 2, 3: 3 }, //placeholder for now
				},
			};
			setSpec(selectedSpec);
			setCharacter(newCharacter);
			setLoading(false);
		}
	}, []);

	const handleSpecChange = (event, newSpec) => {
		//here i also need to know which keybinding to call (ie, which keybinding is selected for the spec), can use current spec
		setSpec(newSpec);
	};
	const handleKeybindingsChange = (event, newKeybindings) => {
		//this is where i want to call for a new call for the keybindings -> need some one to know which
		setKeybinding(newKeybindings);
	};

	async function saveCharacter() {
		let updates = {};
		updates['/Characters/' + characterId] = character;
		updates['/Users/' + userId + '/characters/' + characterId] = {
			name: character.name,
		};
		Object.keys(allKeybindings).forEach(key => {
			updates['/Keybindings/' + key] = allKeybindings[key];
		});

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
		console.log('hello');
	}

	function makeNewKeybindings() {
		const key = ref.child('/Keybindings').push().key;
		//TODO spec change / remove placeholder
		setAllKeybindings({ ...allKeybindings, [key]: { hello: 'there' } });
		if (!character.specs[spec].keybindings) {
			character.specs[spec]['selectedKeybindings'] = key;
			character.specs[spec]['keybindings'] = {
				[key]: {
					description: '',
					talents: { 1: 1, 2: 2, 3: 3 }, //placeholder for now
				},
			};
		}
		//TODO spec change
		character.specs[spec].keybindings[key] = {
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
			<div style={{ marginLeft: '1rem', marginRight: '1rem' }}>
				<Grid
					container
					direction="row"
					justify="space-between"
					alignItems="flex-end"
				>
					<Grid item style={{ marginLeft: '2rem' }}>
						{character.name}
					</Grid>
					<Grid item>
						<Button
							variant="contained"
							disabled={
								character.specs[character.selectedSpec]
									.configured
							}
							style={{
								marginBottom: '-2rem',
							}}
							onClick={selectCharacter}
						>
							Select
						</Button>
						<Button
							variant="contained"
							color="secondary"
							onClick={saveCharacter}
							style={{
								marginBottom: '-2rem',
							}}
						>
							SAVE
						</Button>
					</Grid>
				</Grid>
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
							{character.specs[spec].keybindings &&
								Object.keys(
									character.specs[spec].keybindings
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
					character.specs[spec].keybindings ? (
						Object.keys(character.specs[spec].keybindings).map(
							(val, index) => {
								return (
									<TabPanel
										value={keyBinding}
										key={val}
										index={index}
									>
										<Grid container spacing={1}>
											<Grid
												container
												direction="row"
												justify="space-between"
												alignItems="flex-end"
											>
												<Grid item>
													<Typography variant="h2">
														Description
													</Typography>
												</Grid>
												<Grid item>
													<Button
														variant="contained"
														color="primary"
														style={{
															marginBottom:
																'-2rem',
														}}
													>
														Edit
													</Button>
												</Grid>
											</Grid>
											<Grid container direction="row">
												<Grid item md={12}>
													<Paper
														elevation={3}
														style={{
															padding: '2rem',
														}}
													>
														<Typography
															align="left"
															variant="body2"
														>
															Hello there
														</Typography>
													</Paper>
												</Grid>
											</Grid>
											<br />
											<Grid
												container
												direction="row"
												justify="space-between"
												alignItems="flex-end"
											>
												<Grid item>
													<Typography variant="h2">
														Talents
													</Typography>
												</Grid>
												<Grid item>
													<Button
														variant="contained"
														color="primary"
														style={{
															marginBottom:
																'-2rem',
														}}
													>
														Edit
													</Button>
												</Grid>
											</Grid>
											<Grid container direction="row">
												<Grid item md={12}>
													<ExpansionPanel>
														<ExpansionPanelSummary
															expandIcon={
																<ExpandMoreIcon />
															}
															aria-controls="panel1a-content"
															id="panel1a-header"
														>
															<Typography
																variant="h5"
																align="left"
															>
																Preview
															</Typography>
														</ExpansionPanelSummary>
														<ExpansionPanelDetails>
															<Typography>
																Work In Progress
															</Typography>
														</ExpansionPanelDetails>
													</ExpansionPanel>
												</Grid>
											</Grid>
											<br />
											<Grid
												container
												direction="row"
												justify="space-between"
												alignItems="flex-end"
											>
												<Grid item>
													<Typography variant="h2">
														Keybindings
													</Typography>
												</Grid>
												<Grid item>
													<Button
														variant="contained"
														color="primary"
														style={{
															marginBottom:
																'-2rem',
														}}
													>
														Edit
													</Button>
												</Grid>
											</Grid>
											<Grid container direction="row">
												<Grid item md={12}>
													<ExpansionPanel>
														<ExpansionPanelSummary
															expandIcon={
																<ExpandMoreIcon />
															}
															aria-controls="panel1a-content"
															id="panel1a-header"
														>
															<Typography
																variant="h5"
																align="left"
															>
																Preview
															</Typography>
														</ExpansionPanelSummary>
														<ExpansionPanelDetails>
															<Typography>
																Work In Progress
															</Typography>
														</ExpansionPanelDetails>
													</ExpansionPanel>
												</Grid>
											</Grid>
										</Grid>
									</TabPanel>
								);
							}
						)
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
