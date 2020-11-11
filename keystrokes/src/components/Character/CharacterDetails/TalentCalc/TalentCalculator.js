import React from 'react';
import PropTypes from 'prop-types';
import NormalTalentCalculator from './NormalTalentsCalculator/NormalTalentCalculator';

TalentCalculator.propTypes = {
	character: PropTypes.object,
	setCharacter: PropTypes.func,
	spec: PropTypes.number,
	keyBinding: PropTypes.number,
};
function TalentCalculator({ character, setCharacter, spec, keyBinding }) {
	return (
		<NormalTalentCalculator
			character={character}
			setCharacter={setCharacter}
			spec={spec}
			keyBinding={keyBinding}
		/>
	);
}

export default TalentCalculator;
