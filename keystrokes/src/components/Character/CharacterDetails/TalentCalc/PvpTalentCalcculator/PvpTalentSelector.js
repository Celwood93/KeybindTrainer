import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import { AllSpellsContext } from '../../../../../contexts/AllSpellsContext';
import PvPTalentPanel from '../../../../../assets/PvPTalentPanel.png';

PvpTalentSelector.propTypes = {
	selectedPvpTalents: PropTypes.array,
	setIsOpenIndex: PropTypes.func,
	index: PropTypes.number,
};
function PvpTalentSelector({ selectedPvpTalents, setIsOpenIndex, index }) {
	const allSpells = useContext(AllSpellsContext);
	const [currentPvpTalent, setCurrentPvpTalent] = useState(
		allSpells[selectedPvpTalents[index]] || {}
	);
	useEffect(() => {
		setCurrentPvpTalent(allSpells[selectedPvpTalents[index]] || {});
	}, [selectedPvpTalents]);
	return (
		<Grid
			item
			id={`pvp-talent-selector-${index}`}
			md={12}
			onClick={() => {
				setIsOpenIndex(index);
			}}
			style={{
				cursor: 'pointer',
			}}
		>
			{currentPvpTalent.spellId && currentPvpTalent.iconId ? (
				<a data-wowhead={`spell=${currentPvpTalent.spellId}`}>
					<img
						alt=""
						src={PvPTalentPanel}
						style={{
							maxHeight: '70px',
							backgroundImage: `url(https://wow.zamimg.com/images/wow/icons/large/${currentPvpTalent.iconId}.jpg)`,
							borderRadius: '35px',
							backgroundRepeat: 'no-repeat',
							backgroundPosition: 'center',
						}}
					/>
				</a>
			) : (
				<img
					alt=""
					src={PvPTalentPanel}
					style={{
						maxHeight: '70px',
						backgroundColor: 'black',
						borderRadius: '35px',
						backgroundRepeat: 'no-repeat',
					}}
				/>
			)}
		</Grid>
	);
}

export default PvpTalentSelector;
