import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, Typography, Divider } from '@material-ui/core';
import CharacterCreationModal from './CharacterCreationModal';
import styleGuide from '../../../stylesheets/style';
import { ref } from '../../../config/constants';

CharacterList.propTypes = {
	collectUserInfo: PropTypes.func.isRequired,
	userPath: PropTypes.string.isRequired,
};

function CharacterList({ collectUserInfo, userPath, ...props }) {
	const [characters, setCharacters] = useState({});
	const [selectedCharacter, setSelectedCharacter] = useState('');
	const [open, setOpen] = useState(false);
	const classes = styleGuide();

	useEffect(() => {
		async function gettingUser() {
			//TODO consider putting all DB operations into their own module/util file.
			const user = await collectUserInfo();

			if (user) {
				setCharacters(user.characters || {});
				setSelectedCharacter(user.selectedCharacter);
			}
		}
		gettingUser();
	}, []);

	async function handleSubmit(fields) {
		const key = ref.child('/Characters').push().key;
		props.history.push(
			`${props.location.pathname}/${key}/${JSON.stringify(fields)}`
		);
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
					{Object.keys(characters)
						.sort((_, b) => (b === selectedCharacter ? 1 : -1))
						.map(id => (
							<div
								key={id}
								className={
									id === selectedCharacter
										? classes.characterListItemSelected
										: classes.characterListItem
								}
							>
								<ListItem
									button
									onClick={() => {
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
						))}
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
