import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core';
import talentPanel from '../../../../../assets/talentPanel.png';

NormalTalentBox.propTypes = {
	spellInfo: PropTypes.object,
	selectedTalent: PropTypes.string,
	setSelectedTalent: PropTypes.func,
};
function NormalTalentBox({ selectedTalent, setSelectedTalent, spellInfo }) {
	return (
		<Grid container xs={12} style={{ maxHeight: '45px' }}>
			<Grid item xs={2} style={{ maxHeight: '45px' }}>
				<img
					style={{
						transform: 'rotateY(180deg)',
						maxHeight: '45px',
						filter: 'grayscale(0%)',
					}}
					src={talentPanel}
				/>
			</Grid>
			<Grid item xs={8} style={{ maxHeight: '45px' }}>
				<Grid container xs={12} style={{ maxHeight: '45px' }}>
					<Grid item xs={4} style={{ maxHeight: '45px' }}>
						<img
							style={{
								paddingBottom: '5.5px',
								filter: 'grayscale(0%)',
							}}
							src={`https://wow.zamimg.com/images/wow/icons/medium/${spellInfo.iconId}.jpg`}
						/>
					</Grid>
					<Grid item xs={8} style={{ maxHeight: '45px' }}>
						<div
							style={{
								fontSize: '0.75rem',
							}}
						>
							{spellInfo.spellName}
						</div>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={2} style={{ maxHeight: '45px' }}>
				<img
					style={{ maxHeight: '45px', filter: 'grayscale(0%)' }}
					src={talentPanel}
				/>
			</Grid>
		</Grid>
	);
}

export default NormalTalentBox;
