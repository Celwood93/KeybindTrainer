import React, { useState } from 'react';
import {
	Modal,
	Button,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Grid,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { characterDetails } from '../../../config/constants';
import styleGuide from '../../../stylesheets/style';

CharacterCreationModal.propTypes = {
	handleSubmit: PropTypes.func.isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};

function CharacterCreationModal({ handleSubmit, isOpen, setIsOpen }) {
	const [characterName, setCharacterName] = useState('');
	const [characterClass, setCharacterClass] = useState('');
	const [characterRace, setCharacterRace] = useState('');
	const [characterSpec, setCharacterSpec] = useState('');
	const classes = styleGuide();

	function canSave() {
		return (
			characterName === '' ||
			characterSpec === '' ||
			characterRace === '' ||
			characterName === ''
		);
	}

	return (
		<Modal
			open={isOpen}
			onClose={() => setIsOpen(false)}
			className={classes.modal}
		>
			<div className={classes.paper}>
				<Grid container spacing={2} alignItems="center">
					<Grid item>
						<TextField
							label="Character Name"
							id="CharacterNameInput"
							value={characterName}
							onChange={event =>
								setCharacterName(event.target.value)
							}
							variant="outlined"
							className={classes.button}
						/>
					</Grid>
					<Grid item>
						<FormControl className={classes.button}>
							<InputLabel>Race</InputLabel>
							<Select
								id="CharacterRaceInput"
								value={characterRace}
								onChange={event =>
									setCharacterRace(event.target.value)
								}
							>
								{characterDetails.race.map(race => (
									<MenuItem
										key={race}
										value={race}
										id={`${race.replace(
											/ |:|'/g,
											''
										)}-option`}
									>
										{race}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item>
						<FormControl className={classes.button}>
							<InputLabel>Class</InputLabel>
							<Select
								id="CharacterClassInput"
								value={characterClass}
								onChange={event =>
									setCharacterClass(event.target.value)
								}
							>
								{Object.keys(characterDetails.class).map(
									heroClass => (
										<MenuItem
											key={heroClass}
											id={`${heroClass.replace(
												/ |:|'/g,
												''
											)}-option`}
											value={heroClass}
										>
											{heroClass}
										</MenuItem>
									)
								)}
							</Select>
						</FormControl>
					</Grid>
					<Grid item>
						<FormControl
							disabled={!characterClass}
							className={classes.button}
						>
							<InputLabel>Spec</InputLabel>
							<Select
								id="CharacterSpecInput"
								value={characterSpec}
								onChange={event =>
									setCharacterSpec(event.target.value)
								}
							>
								{characterDetails.class[characterClass].map(
									spec => (
										<MenuItem
											key={spec}
											id={`${spec.replace(
												/ |:|'/g,
												''
											)}-option`}
											value={characterDetails.class[
												characterClass
											].findIndex(ele => ele === spec)}
										>
											{spec}
										</MenuItem>
									)
								)}
							</Select>
						</FormControl>
					</Grid>
				</Grid>
				<Grid container justify="flex-end">
					<Grid item className={classes.paddingTop}>
						<Button
							size="large"
							onClick={() => {
								setIsOpen(false);
								setCharacterClass('');
								setCharacterName('');
								setCharacterSpec('');
								setCharacterRace('');
							}}
						>
							Cancel
						</Button>
					</Grid>
					<Grid item className={classes.paddingTop}>
						<Button
							disabled={canSave()}
							size="large"
							onClick={() => {
								handleSubmit({
									characterClass,
									name: characterName,
									spec: characterSpec,
									race: characterRace,
								});
								setIsOpen(false);
							}}
						>
							Submit
						</Button>
					</Grid>
				</Grid>
			</div>
		</Modal>
	);
}

export default CharacterCreationModal;
