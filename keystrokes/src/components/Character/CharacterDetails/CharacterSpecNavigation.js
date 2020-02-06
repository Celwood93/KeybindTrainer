import React from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs, AppBar } from '@material-ui/core';
import { a11yProps } from '../helpers/TabPanels';
import { characterDetails } from '../../../config/constants';
import CharacterKeybindDisplay from './CharacterKeybindDisplay';

CharacterSpecNavigation.propTypes = {
	character: PropTypes.obj,
	spec: PropTypes.number,
	setSpec: PropTypes.func,
	keyBinding: PropTypes.obj,
	setKeyBinding: PropTypes.func,
	makeNewKeybindings: PropTypes.func,
};
function CharacterSpecNavigation({
	character,
	spec,
	setSpec,
	keyBinding,
	setKeybinding,
	makeNewKeybindings,
}) {
	const handleSpecChange = (event, newSpec) => {
		setKeybinding(character.specs[newSpec].selectedKeybindings || 0);
		setSpec(newSpec);
	};
	const handleKeybindingsChange = (event, newKeybindings) => {
		setKeybinding(newKeybindings);
	};

	return (
		<React.Fragment>
			<AppBar position="static" color="default">
				<Tabs
					value={spec}
					onChange={handleSpecChange}
					textColor="primary"
					variant="fullWidth"
					scrollButtons="auto"
					aria-label="scrollable auto tabs example"
				>
					{characterDetails.class[character.class].map(spec => {
						return (
							<Tab label={spec} key={spec} {...a11yProps(spec)} />
						);
					})}
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
						Object.keys(character.specs[spec].keybindings).map(
							(val, index) => {
								const tabLabel = `Keybindings-${index + 1}`;
								return (
									<Tab
										label={tabLabel}
										key={val}
										{...a11yProps(val)}
									/>
								);
							}
						)}
					<Tab
						onClick={() => makeNewKeybindings(spec, character)}
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
							<CharacterKeybindDisplay
								keyBinding={keyBinding}
								key={index}
								val={val}
								index={index}
							/>
						);
					}
				)
			) : (
				<div>Click 'Create new keybindings' to get started!</div>
			)}
		</React.Fragment>
	);
}

export default CharacterSpecNavigation;
