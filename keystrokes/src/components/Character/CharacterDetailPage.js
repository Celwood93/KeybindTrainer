import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs, AppBar, CircularProgress } from '@material-ui/core';
import '../../stylesheets/character.css';
import styleGuide from '../../stylesheets/style';
import { TabPanel, a11yProps } from './TabPanels';
import { ref, characterDetails } from '../../config/constants';

PropTypes.propTypes = {
	userId: PropTypes.string,
	match: PropTypes.obj,
};
function CharacterDetailPage({ userId, match, ...props }) {
	const [spec, setSpec] = useState(0); //replace 0 with something from props.
	const [keyBinding, setKeybindings] = useState(0); //replace 0 with something related to spec\
	const [loading, setLoading] = useState(true);
	const [character, setCharacter] = useState(0);
	const characterId = match.params && match.params[0];

	useEffect(() => {
		async function collectCharacterInfo() {
			const path = `/Characters/${characterId}`;
			const snapShot = await ref.child(path).once('value');
			if (snapShot.exists()) {
				setCharacter(snapShot.val());
			}
			console.log(snapShot.val());
			setLoading(false);
		}
		collectCharacterInfo();
	}, []);

	const handleSpecChange = (event, newSpec) => {
		setSpec(newSpec);
	};
	const handleKeybindChange = (event, newKeybindings) => {
		setKeybindings(newKeybindings);
	};

	function makeNewKeybindings() {}

	return !loading ? (
		<React.Fragment>
			<div style={{ marginLeft: '1rem', marginRight: '1rem' }}>
				<div style={{ paddingLeft: '5rem', textAlign: 'left' }}>
					{character.name}
				</div>
				<div className={styleGuide.tabRoot}>
					<AppBar position="static" color="default">
						<Tabs
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
							onChange={handleKeybindChange}
							variant="scrollable"
							scrollButtons="auto"
							aria-label="nav tabs example"
						>
							{character.specs[spec] &&
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
						character.specs[spec].keybindings.map(val => {
							return (
								<TabPanel
									value={keyBinding}
									key={val}
									index={val}
								>
									keybinding {val}
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
