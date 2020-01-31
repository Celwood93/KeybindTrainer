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
				//holy shit there has to be a better way to figure out what spec you currently are... DB needs a cleanup for sure...
				setSpec(
					characterDetails.class[charDetails.class].findIndex(
						ele =>
							ele ===
							Object.keys(charDetails.specs).filter(
								spec => charDetails.specs[spec].selected
							)[0]
					)
				);
				setCharacter(charDetails);
			}
			setLoading(false);
		}
		if (!fields) {
			collectCharacterInfo();
		} else {
			//should be in a function
			const { name, characterClass, race } = fields;
			const curSpec = fields.spec;
			const specs = {};
			characterDetails.class[characterClass].forEach(spec => {
				specs[spec] = {
					spec,
					selected: spec === curSpec,
					configured: false,
				};
			});
			const newCharacter = {
				class: characterClass,
				race,
				name,
				specs,
			};
			setSpec(
				characterDetails.class[characterClass].findIndex(
					ele => ele === curSpec
				)
			);
			setCharacter(newCharacter);
			setLoading(false);
		}
	}, []);

	const handleSpecChange = (event, newSpec) => {
		setSpec(newSpec);
	};
	const handleKeybindingsChange = (event, newKeybindings) => {
		setKeybinding(newKeybindings);
	};

	async function makeNewKeybindings() {
		const keybindingSnapshot = await ref
			.child('/Keybindings')
			.once('value');
		const id = await keybindingSnapshot.push({
			//i think these should not be in keybindings, only in characters (description and talents)
			description,
			talents,
			keybindings: keyBinds,
		});

		setKeybinding(id);
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
							value={characterDetails.class[
								character.class
							].findIndex(
								ele =>
									ele ===
									characterDetails.class[character.class][
										spec
									]
							)}
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
							{character.specs[spec] &&
								character.specs[spec].keybindings &&
								character.specs[spec].keybindings.map(val => {
									const tabLabel = `Keybinding ${val}`;
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
					{character.specs[spec] &&
						character.specs[spec].keybindings &&
						character.specs[spec].keybindings.map(val => {
							return (
								<TabPanel
									value={keyBinding}
									key={val}
									index={val}
								>
									<Grid container spacing={1}>
										<Grid container direction="row">
											<Grid item>
												<Paper>Description</Paper>
											</Grid>
											<Grid item>
												<Paper>blah</Paper>
											</Grid>
										</Grid>
									</Grid>
								</TabPanel>
							);
						})}
				</div>
			</div>
		</React.Fragment>
	) : (
		<CircularProgress />
	);
}

export default CharacterDetailPage;
