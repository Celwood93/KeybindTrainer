import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import NormalTalentCalculator from './NormalTalentsCalculator/NormalTalentCalculator';
import CovenantCalculator from './CovenantCalculator/CovenantCalculator';
import PvpTalentCalculator from './PvpTalentCalcculator/PvpTalentCalculator';
import { removeWaterMark } from '../../../utils/toolTipHooks';

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
	removeWaterMark(`#panel1a-content a`);
	return (
		<Grid container direction="column" spacing={2}>
			<Grid container direction="row" justify="center">
				<NormalTalentCalculator
					character={character}
					setCharacter={setCharacter}
					spec={spec}
					keyBinding={keyBinding}
					allKeybindings={allKeybindings}
					setAllKeybindings={setAllKeybindings}
				/>
				<PvpTalentCalculator
					character={character}
					setCharacter={setCharacter}
					spec={spec}
					keyBinding={keyBinding}
					allKeybindings={allKeybindings}
					setAllKeybindings={setAllKeybindings}
				/>
			</Grid>
			<Grid
				container
				direction="row"
				justify="center"
				alignItems="center"
			>
				<CovenantCalculator
					character={character}
					setCharacter={setCharacter}
					spec={spec}
					keyBinding={keyBinding}
					allKeybindings={allKeybindings}
					setAllKeybindings={setAllKeybindings}
				/>
			</Grid>
		</Grid>
	);
}

export default TalentCalculator;
