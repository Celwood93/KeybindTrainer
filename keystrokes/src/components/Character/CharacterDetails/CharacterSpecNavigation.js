import React from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs, AppBar } from '@material-ui/core';
import { a11yProps } from '../helpers/TabPanels';
import { characterDetails } from '../../../config/constants';
import CharacterKeybindDisplay from './CharacterKeybindDisplay';

CharacterSpecNavigation.propTypes = {
	character: PropTypes.object,
	setCharacter: PropTypes.func,
	makeNewKeybindings: PropTypes.func,
	allKeybindings: PropTypes.object,
	setAllKeybindings: PropTypes.func,
	createNewKeybinding: PropTypes.func,
	keyBinding: PropTypes.number,
	setKeybinding: PropTypes.func,
	spec: PropTypes.number,
	setSpec: PropTypes.func,
};
function CharacterSpecNavigation({
	character,
	setCharacter,
	makeNewKeybindings,
	allKeybindings,
	setAllKeybindings,
	createNewKeybinding,
	keyBinding,
	setKeybinding,
	spec,
	setSpec,
}) {
	function handleSpecChange(event, newSpec) {
		if (
			character.specs[newSpec] &&
			character.specs[newSpec].keybindings &&
			character.specs[newSpec].keybindings.length > 0
		) {
			setKeybinding(character.specs[newSpec].selectedKeybindings || 0);
			setSpec(newSpec);
		} else {
			createNewKeybinding(newSpec, character);
		}
	}

	function handleKeybindingsChange(event, newKeybindings) {
		setKeybinding(newKeybindings);
	}

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
					{characterDetails.class[character.class].map(spec => (
						<Tab label={spec} key={spec} {...a11yProps(spec)} />
					))}
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
						Object.keys(
							character.specs[spec].keybindings
						).map((val, index) => (
							<Tab
								label={`Keybindings-${index + 1}`}
								key={val}
								{...a11yProps(val)}
							/>
						))}
					<Tab
						onClick={() => makeNewKeybindings(spec, character)}
						label="Create New Keybindings"
					/>
				</Tabs>
			</AppBar>
			{//So, you create a new character, then you go to your character page. you then hit create new keybindings
			//if no keybindings exist yet then there is a thing HERE that says "click create new keybiindings to get started!"
			character.specs[spec] &&
			character.specs[spec].keybindings.length > 0 ? (
				Object.keys(character.specs[spec].keybindings).map(
					(val, index) => {
						return (
							<CharacterKeybindDisplay
								keyBinding={keyBinding}
								character={character}
								setCharacter={setCharacter}
								allKeybindings={allKeybindings}
								setAllKeybindings={setAllKeybindings}
								spec={spec}
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
