import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import talentPanel from '../../../../assets/talentPanel.png';

ButtonTalCovFrame.propTypes = {
	spellInfo: PropTypes.object,
	selectedOption: PropTypes.string,
	setSelectedOption: PropTypes.func,
	children: PropTypes.node.isRequired,
	styling: PropTypes.array,
};
function ButtonTalCovFrame({
	selectedOption,
	setSelectedOption,
	spellInfo,
	children,
	styling = [{}, {}, {}],
}) {
	const [mousedOver, setMousedOver] = useState(false);
	return (
		<Grid
			id={`talent-container-${spellInfo.spellId}`}
			container
			onMouseEnter={() => {
				setMousedOver(true);
			}}
			onMouseLeave={() => {
				setMousedOver(false);
			}}
			style={{
				...{
					height: '45px',
					backgroundColor: 'black',
					border: `2px solid ${
						selectedOption !== spellInfo.spellId
							? 'gray'
							: '#b08f00'
					}`,
					cursor: 'pointer',
				},
				...styling[2],
			}}
			onClick={() => {
				setSelectedOption(spellInfo.spellId);
			}}
			onContextMenu={ev => {
				ev.preventDefault();
				if (selectedOption === spellInfo.spellId) {
					setSelectedOption('');
				}
			}}
		>
			<Grid item md={2} style={{ height: '45px' }}>
				<img
					alt=""
					style={{
						...{
							transform: 'rotateY(180deg)',
							height: '41px',
							filter: `grayscale(${
								selectedOption !== spellInfo.spellId
									? mousedOver
										? 60
										: 100
									: 0
							}%)`,
							position: 'absolute',
							marginLeft: '-16.5px',
						},
						...styling[0],
					}}
					src={talentPanel}
				/>
			</Grid>
			<Grid item md={8} style={{ height: '45px' }}>
				{children}
			</Grid>
			<Grid item md={2} style={{ height: '45px' }}>
				<img
					alt=""
					style={{
						...{
							height: '41px',
							filter: `grayscale(${
								selectedOption !== spellInfo.spellId
									? mousedOver
										? 60
										: 100
									: 0
							}%)`,
							position: 'absolute',
							marginLeft: '-8.5px',
						},
						...styling[1],
					}}
					src={talentPanel}
				/>
			</Grid>
		</Grid>
	);
}

export default ButtonTalCovFrame;
