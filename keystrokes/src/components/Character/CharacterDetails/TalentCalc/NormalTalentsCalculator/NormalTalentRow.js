import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
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
		<Grid item xs={12}>
			<Grid
				container
				justify="center"
				direction="row"
				spacing={1}
				xs={12}
				style={{ maxHeight: '45px' }}
			>
				{spellsInfo.map(spellInfo => {
					return (
						<Grid
							key={spellInfo.spellId}
							item
							xs={4}
							style={{ maxHeight: '45px' }}
						>
							<NormalTalentBox
								spellInfo={spellInfo}
								selectedTalent={selectedTalent}
								setSelectedTalent={setSelectedTalent}
							/>
						</Grid>
					);
				})}
			</Grid>
		</Grid>
	);
}

export default NormalTalentRow;
