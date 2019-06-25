import React from 'react';
import '../../stylesheets/character.css';

function Character(props) {
	const characterNames = ['MyMain', 'MyFavorite', 'TheBestGuy'];
	const currentCharacter = 'Choose a Character'; //default if nothing is selected
	console.log(props);
	return (
		<div>
			<div>{currentCharacter}</div>
			<button>Create Character</button>
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
