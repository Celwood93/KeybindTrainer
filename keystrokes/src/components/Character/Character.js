import React, { useState } from 'react';
import '../../stylesheets/character.css';
import { ref } from '../../config/constants';
import CharacterCreationModal from './CharacterCreationModal';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Typography,
} from '@material-ui/core';
//import CharacterCreationPage from 'CharacterCreationPage';

function Character(props) {
	console.log(props);
	const [name, setName] = useState();
	//const [className, setClassName] = useState({ className: '' });
	//const [specName, setSpecName] = useState({ specName: '' });
	//check to see if user in props is empty
	//if it is empty have choose character as default, otherwise set it as the current character
	//if it isnt empty have last character as current character, and list the new characters below
	//upon clicking create character take the user to a character creation page -> stub for now?
	//Inside of this character creation page is where we need to save the user values?

	//So we want to make it so that the render value is a variable that is saved in state
	//when we click the button we will change that variable, and then we will remount (i think it will auto update)
	//

	let currentCharacterId = 'Create A New Character'; //default if no character exists
	let characterIds = [];
	if (props.user && !!props.user.currentCharacterId) {
		currentCharacterId = props.user.currentCharacterId;
	}
	if (props.user && !!props.user.characterIds) {
		characterIds = props.user.characterIds;
		//this accounts for when a currentCharacterId is lost when characters still exist
		//could potentially arise if character deletion is implemented.
		if (props.user && !!props.user.currentCharacterId) {
			currentCharacterId = 'Select A Character';
		}
	}

	function handleChange(event) {
		console.log(event, name);
		setName(event.target.value);
	}

	async function handleSubmit(event) {
		event.preventDefault();
		let snapshot = await ref.child(props.userPath);
		let tests = await snapshot.once('value');
		const id = props.userId;
		if (tests.exists()) {
			snapshot.update({
				currentCharacter: name,
			});
			snapshot
				.child('characters')
				.child(name)
				.set({ name: name });
		} else {
			snapshot.set({
				currentCharacter: name,
				characters: {},
			});
			snapshot
				.child('characters')
				.child(name)
				.set({ name: name });
		}

		//
	}

	return (
		<div>
			<div>{currentCharacterId}</div>
			<form onSubmit={handleSubmit}>
				<label>
					Name?
					<input type="text" value={name} onChange={handleChange} />
				</label>
				<input type="submit" value="Submit" />
			</form>
			<div>
				{characterIds.map((comp, i) => {
					return (
						<li className="character-links">
							<Button>{comp}</Button>
						</li>
					);
				})}
			</div>
		</div>
	);
}

export default Character;
