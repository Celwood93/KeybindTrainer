import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';

NormalTalentBox.propTypes = {
	spellInfo: PropTypes.object,
	selectedTalent: PropTypes.string,
};
function NormalTalentBox({ selectedTalent, spellInfo }) {
	const [margTopVal, setMargTopVal] = useState('5.5px');
	useEffect(() => {
		const resizeObserver = new window.ResizeObserver(entry => {
			if (entry && entry[0] && entry[0].contentRect) {
				if (entry[0].contentRect.height === 14) {
					setMargTopVal('14px');
				} else if (entry[0].contentRect.height === 42) {
					setMargTopVal('0px');
				} else if (entry[0].contentRect.height === 28) {
					setMargTopVal('6.5px');
				}
			}
		});
		if (spellInfo.spellName) {
			const divEl = document.querySelector(`#cs${spellInfo.spellId}`);
			if (divEl) {
				resizeObserver.observe(divEl);
			}
		}
	}, [spellInfo]);
	return (
		<Grid item md={12} style={{ height: '45px' }}>
			<Grid container style={{ height: '45px' }}>
				<Grid item md={4} style={{ height: '45px' }}>
					<a data-wowhead={`spell=${spellInfo.spellId}`}>
						<img
							alt=""
							style={{
								filter: `grayscale(${
									selectedTalent !== spellInfo.spellId
										? !selectedTalent
											? 0
											: 100
										: 0
								}%)`,
								position: 'absolute',
								marginLeft: '-25px',
								marginTop: '3px',
							}}
							src={`https://wow.zamimg.com/images/wow/icons/medium/${spellInfo.iconId}.jpg`}
						/>
					</a>
				</Grid>
				<Grid item md={8} style={{ height: '45px' }}>
					<a data-wowhead={`spell=${spellInfo.spellId}`}>
						<div
							id={`cs${spellInfo.spellId}`}
							style={{
								fontSize: '0.75rem',
								marginTop: margTopVal,
								color: 'white',
							}}
						>
							{spellInfo.spellName}
						</div>
					</a>
				</Grid>
			</Grid>
		</Grid>
	);
}

export default NormalTalentBox;
