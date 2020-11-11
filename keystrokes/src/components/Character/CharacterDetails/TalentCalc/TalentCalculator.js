import React from 'react';
import PropTypes from 'prop-types';
import NormalTalentCalculator from './NormalTalentsCalculator/NormalTalentCalculator';

TalentCalculator.propTypes = {
	character: PropTypes.object,
	setCharacter: PropTypes.func,
	spec: PropTypes.number,
};
function TalentCalculator({ character, setCharacter, spec }) {
	return (
		<NormalTalentCalculator
			character={character}
			setCharacter={setCharacter}
			spec={spec}
		/>
	);
}

export default TalentCalculator;
