import React, { useState, useEffect } from 'react';
import '../../stylesheets/character.css';
import styleGuide from '../../stylesheets/style';
import { ref } from '../../config/constants';
import { List, ListItem, Typography, Divider } from '@material-ui/core';
import CharacterCreationModal from './CharacterCreationModal';
import PropTypes from 'prop-types';

CharacterList.propTypes = {
	userInfo: PropTypes.object.isRequired,
	userPath: PropTypes.string.isRequired,
};

function CharacterList({ userInfo, userPath }) {
	const [characters, setCharacters] = useState({});
	const [currentCharacter, setCurrentCharacter] = useState('');
	const [open, setOpen] = useState(false);
	const classes = styleGuide();

	useEffect(() => {
		setCharacters(userInfo.characters || {});
		setCurrentCharacter(userInfo.currentCharacter);
	}, [userInfo]);

	const handleOpen = () => {
		setOpen(true);
	};

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
		let userCharacterData = await snapshot.once('value');

		if (userCharacterData.exists()) {
			snapshot
				.child('characters')
				.child(idKey) //name should probably be a real key
				.set({ name: name });
		} else {
			snapshot.set({
				currentCharacter: name,
				characters: {
					[idKey]: {
						name,
					},
				},
			});
		}
		setCharacters({ ...characters, idKey: { name: name } }); //immutabilityHelper here
	}

	return (
		<React.Fragment>
			{open && (
				<CharacterCreationModal
					isOpen={open}
					setIsOpen={setOpen}
					handleSubmit={handleSubmit}
				/>
			)}
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
					{!!currentCharacter && (
						<React.Fragment>
							<div className={classes.characterListItemSelected}>
								<ListItem
									button
									onClick={() => {
										console.log('hello');
									}}
								>
									<div className={classes.charListItem}>
										<Typography align="center">
											{characters[currentCharacter].name}
										</Typography>
									</div>
								</ListItem>
								<Divider />
							</div>
							<div style={{ paddingTop: '1rem' }} />
						</React.Fragment>
					)}
					{Object.keys(characters)
						.filter(details => details !== currentCharacter)
						.map(id => {
							return (
								<React.Fragment key={id}>
									<div className={classes.characterListItem}>
										<ListItem
											button
											onClick={() => {
												console.log('hello');
											}}
										>
											<div
												className={classes.charListItem}
											>
												<Typography align="center">
													{characters[id].name}
												</Typography>
											</div>
										</ListItem>
										<Divider />
									</div>
									<div style={{ paddingTop: '1rem' }} />
								</React.Fragment>
							);
						})}
					<div className={classes.newCharacterListItem}>
						<ListItem button onClick={handleOpen}>
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
