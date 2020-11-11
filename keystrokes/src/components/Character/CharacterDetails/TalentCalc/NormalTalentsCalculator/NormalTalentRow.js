import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core';
import NormalTalentBox from './NormalTalentBox';

NormalTalentRow.propTypes = {
	character: PropTypes.object,
	setCharacter: PropTypes.func,
	level: PropTypes.number,
	spellsInfo: PropTypes.array,
};
function NormalTalentRow({ character, setCharacter, level, spellsInfo }) {
	const [selectedTalent, setSelectedTalent] = useState('');
	return (
		<Grid
			container
			justify="center"
			direction="row"
			spacing={0}
			xs={12}
			style={{ maxHeight: '45px' }}
		>
			{spellsInfo.map(spellInfo => {
				return (
					<Grid item xs={4} style={{ maxHeight: '45px' }}>
						<NormalTalentBox
							spellInfo={spellInfo}
							selectedTalent={selectedTalent}
							setSelectedTalent={setSelectedTalent}
						/>
					</Grid>
				);
			})}
		</Grid>
	);
}

export default NormalTalentRow;
