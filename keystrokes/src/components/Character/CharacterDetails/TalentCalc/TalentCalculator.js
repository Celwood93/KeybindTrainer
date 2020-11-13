import React from 'react';
import PropTypes from 'prop-types';
import NormalTalentCalculator from './NormalTalentsCalculator/NormalTalentCalculator';
import CovenantCalculator from './CovenantCalculator/CovenantCalculator';

TalentCalculator.propTypes = {
	character: PropTypes.object,
	setCharacter: PropTypes.func,
	spec: PropTypes.number,
	keyBinding: PropTypes.number,
	allKeybindings: PropTypes.object,
	setAllKeybindings: PropTypes.func,
};
function TalentCalculator({
	character,
	setCharacter,
	spec,
	keyBinding,
	allKeybindings,
	setAllKeybindings,
}) {
	return (
		<div>
			<NormalTalentCalculator
				character={character}
				setCharacter={setCharacter}
				spec={spec}
				keyBinding={keyBinding}
				allKeybindings={allKeybindings}
				setAllKeybindings={setAllKeybindings}
			/>
			<CovenantCalculator
				character={character}
				setCharacter={setCharacter}
				spec={spec}
				keyBinding={keyBinding}
				allKeybindings={allKeybindings}
				setAllKeybindings={setAllKeybindings}
			/>
		</div>
	);
}

export default TalentCalculator;
