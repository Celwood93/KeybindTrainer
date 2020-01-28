import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, Typography, Divider } from '@material-ui/core';
import CharacterCreationModal from './CharacterCreationModal';
import '../../stylesheets/character.css';
import styleGuide from '../../stylesheets/style';
import { ref } from '../../config/constants';

CharacterList.propTypes = {
	userInfo: PropTypes.object.isRequired,
	userPath: PropTypes.string.isRequired,
};

function CharacterList({ userInfo, userPath, ...props }) {
	const [characters, setCharacters] = useState({});
	const [currentCharacter, setCurrentCharacter] = useState('');
	const [open, setOpen] = useState(false);
	const classes = styleGuide();

	useEffect(() => {
		setCharacters(userInfo.characters || {});
		setCurrentCharacter(userInfo.currentCharacter);
	}, [userInfo]);

	async function handleSubmit(fields) {
		const { name, characterClass, spec, race } = fields;
		let charactersSnapShot = await ref.child('/Characters');

		const id = charactersSnapShot.push({
			class: characterClass,
			race,
			name,
			specs: {
				[spec]: {
					spec,
					selected: true,
					configured: false,
				},
			},
		});
		const idKey = id.key;
		let snapshot = await ref.child(userPath);
		snapshot
			.child('characters')
			.child(idKey)
			.set({ name });
		setCurrentCharacter(idKey);
		setCharacters({ ...characters, [idKey]: { name } });
	}

	return (
		<React.Fragment>
			<CharacterCreationModal
				isOpen={open}
				setIsOpen={setOpen}
				handleSubmit={handleSubmit}
			/>
			<Typography variant="h1" align="center">
				Character List
			</Typography>
			<Typography
				variant="h3"
				align="center"
				color="textSecondary"
				gutterBottom
			>
				Edit a character from the list or create a new character.
			</Typography>
			<div className={classes.characterList}>
				<List>
					{[
						currentCharacter,
						...Object.keys(characters).filter(
							details => details !== currentCharacter
						),
					].map(id => {
						return (
							<React.Fragment key={id}>
								<div
									className={
										id === currentCharacter
											? classes.characterListItemSelected
											: classes.characterListItem
									}
								>
									<ListItem
										button
										onClick={() => {
											console.log(id);
											props.history.push(
												`${props.location.pathname}/${id}`
											);
										}}
									>
										<div className={classes.charListItem}>
											<Typography align="center">
												{characters[id] &&
													characters[id].name}
											</Typography>
										</div>
									</ListItem>
									<Divider />
								</div>
							</React.Fragment>
						);
					})}
					<div className={classes.newCharacterListItem}>
						<ListItem button onClick={() => setOpen(true)}>
							<div className={classes.newCharListItem}>
								<Typography align="center">
									Create A New Character
								</Typography>
							</div>
						</ListItem>
					</div>
					<Divider />
				</List>
			</div>
		</React.Fragment>
	);
}

export default CharacterList;
