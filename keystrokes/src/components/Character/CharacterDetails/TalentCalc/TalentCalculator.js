import React from 'react';
import PropTypes from 'prop-types';
import NormalTalentCalculator from './NormalTalentsCalculator/NormalTalentCalculator';

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
		<NormalTalentCalculator
			character={character}
			setCharacter={setCharacter}
			spec={spec}
			keyBinding={keyBinding}
			allKeybindings={allKeybindings}
			setAllKeybindings={setAllKeybindings}
		/>
	);
}

export default TalentCalculator;
