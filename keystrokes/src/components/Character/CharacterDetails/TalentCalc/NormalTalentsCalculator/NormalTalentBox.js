import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './talentBox.css';
import { Grid } from '@material-ui/core';
import talentPanel from '../../../../../assets/talentPanel.png';
import './talentBox.css';

NormalTalentBox.propTypes = {
	spellInfo: PropTypes.object,
	selectedTalent: PropTypes.string,
	setSelectedTalent: PropTypes.func,
};
function NormalTalentBox({ selectedTalent, setSelectedTalent, spellInfo }) {
	const [margTopVal, setMargTopVal] = useState('5.5px');
	const [mousedOver, setMousedOver] = useState(false);
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
		<a
			id={`df${spellInfo.spellId}`}
			data-wowhead={`spell=${spellInfo.spellId}`}
		>
			<Grid
				container
				xs={12}
				onMouseEnter={() => {
					setMousedOver(true);
				}}
				onMouseLeave={() => {
					setMousedOver(false);
				}}
				style={{
					height: '45px',
					backgroundColor: 'black',
					border: `2px solid ${
						selectedTalent !== spellInfo.spellId
							? 'gray'
							: '#b08f00'
					}`,
					cursor: 'pointer',
				}}
				onClick={() => {
					setSelectedTalent(spellInfo.spellId);
				}}
			>
				<Grid item xs={2} style={{ height: '45px' }}>
					<img
						alt=""
						style={{
							transform: 'rotateY(180deg)',
							height: '41px', //45
							filter: `grayscale(${
								selectedTalent !== spellInfo.spellId
									? mousedOver
										? 60
										: 100
									: 0
							}%)`,
							position: 'absolute',
							marginLeft: '-16.5px',
						}}
						src={talentPanel}
					/>
				</Grid>
				<Grid item xs={8} style={{ height: '45px' }}>
					<Grid container xs={12} style={{ height: '45px' }}>
						<Grid item xs={4} style={{ height: '45px' }}>
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
						<Grid item xs={8} style={{ height: '45px' }}>
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
				<Grid item xs={2} style={{ height: '45px' }}>
					<img
						alt=""
						style={{
							height: '41px',
							filter: `grayscale(${
								selectedTalent !== spellInfo.spellId
									? mousedOver
										? 60
										: 100
									: 0
							}%)`,
							position: 'absolute',
							marginLeft: '-8.5px',
						}}
						src={talentPanel}
					/>
				</Grid>
			</Grid>
		</a>
	);
}

export default NormalTalentBox;
