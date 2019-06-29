import React from 'react';
import '../../stylesheets/character.css';

function Character(props) {
	console.log(props);
	//check to see if user in props is empty
	//if it is empty have choose character as default, otherwise set it as the current character
	//if it isnt empty have last character as current character, and list the new characters below
	//upon clicking create character take the user to a character creation page -> stub for now?
	//Inside of this character creation page is where we need to save the user values?

	let currentCharacterId = 'Create A New Character'; //default if nothing is selected
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
	return (
		<div>
			<div>{currentCharacter}</div>
			<button onClick={createCharacter}>Create Character</button>
			<div>
				{characterNames.map((comp, i) => {
					return (
						<li className="character-links">
							<button>{comp}</button>
						</li>
					);
				})}
			</div>
		</div>
	);
}

export default Character;
