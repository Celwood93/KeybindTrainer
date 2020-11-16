import React, { useState, useEffect, useContext } from 'react';
import { Modal, Grid, Button } from '@material-ui/core';
import update from 'immutability-helper';
import PropTypes from 'prop-types';
import { removeLingeringPopups } from '../../../../utils/toolTipHooks';
import styleGuide from '../../../../../stylesheets/style';
import { AllSpellsContext } from '../../../../../contexts/AllSpellsContext';
import ButtonTalCovFrame from '../ButtonTalCovFrame';
import NormalTalentBox from '../NormalTalentsCalculator/NormalTalentBox';

PvpTalentModal.propTypes = {
	isOpenIndex: PropTypes.number.isRequired, //3 is closed, 0,1,2 represent the 3 different indexes
	setIsOpenIndex: PropTypes.func.isRequired,
	pvpTalents: PropTypes.array.isRequired,
	selectedPvpTalents: PropTypes.array.isRequired,
	setSelectedPvpTalents: PropTypes.func.isRequired,
};

function PvpTalentModal({
	isOpenIndex,
	setIsOpenIndex,
	pvpTalents,
	selectedPvpTalents,
	setSelectedPvpTalents,
}) {
	const classes = styleGuide();
	const allSpells = useContext(AllSpellsContext);
	function setOption(spellId) {
		setSelectedPvpTalents(
			update(selectedPvpTalents, {
				[isOpenIndex]: {
					$set: spellId,
				},
			})
		);

		setIsOpenIndex(3);
		removeLingeringPopups();
	}
	return (
		<Modal
			open={isOpenIndex !== 3}
			onClose={() => {}}
			className={classes.pvpTalentModal}
		>
			<div className={classes.pvpTalentModalBackground}>
				<div
					style={{
						position: 'relative',
						float: 'right',
						color: 'red',
						top: '-13px',
						left: '21px',
						maxWidth: '10px',
						maxHeight: '0px',
						cursor: 'pointer',
					}}
					onClick={() => {
						setIsOpenIndex(3);
					}}
				>
					x
				</div>
				<Grid container direction="column">
					{pvpTalents
						.filter(e => !allSpells[e].hidden)
						.map(talent => {
							const spellInfo = allSpells[talent];
							return (
								<ButtonTalCovFrame
									key={spellInfo.spellId}
									spellInfo={spellInfo}
									selectedOption={
										selectedPvpTalents[isOpenIndex]
									}
									setSelectedOption={setOption}
									styling={[
										{ marginLeft: '0px' },
										{ marginLeft: '9px' },
										{ marginBottom: '3px' },
									]}
									children={
										<NormalTalentBox
											spellInfo={spellInfo}
											styling={[
												{ marginLeft: '15px' },
												{ marginLeft: '25px' },
											]}
											selectedTalent={
												selectedPvpTalents[isOpenIndex]
											}
										/>
									}
								/>
							);
						})}
				</Grid>
			</div>
		</Modal>
	);
}

export default PvpTalentModal;
