import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

CovenantBox.propTypes = {
	spellsInfo: PropTypes.object,
	selectedCov: PropTypes.string,
};
function CovenantBox({ selectedCov, spellsInfo }) {
	const covLinks = {
		Kyrian: 'ui_sigil_kyrian',
		Necrolord: 'ui_sigil_necrolord',
		'Night Fae': 'ui_sigil_nightfae',
		Venthyr: 'ui_sigil_venthyr',
	};
	const useStylesCustomTooltip = makeStyles(theme => ({
		arrow: {
			color: theme.palette.common.black,
		},
		tooltip: {
			backgroundColor: theme.palette.common.black,
		},
	}));
	function CustomTooltip(props) {
		const classes = useStylesCustomTooltip();
		return <Tooltip arrow classes={classes} {...props} />;
	}

	let list = Object.keys(spellsInfo.spellsDetails)
		.map(e => spellsInfo.spellsDetails[e].spellDetail)
		.filter(e => !e.hidden);
	list.splice(1, 0, {
		spellId: spellsInfo.spellId,
		notASpell: true,
	});
	return (
		<Grid item md={12} style={{ height: '45px' }}>
			<Grid container style={{ height: '45px' }}>
				{list.map(covSpellOrName => {
					if (!covSpellOrName.iconId) {
						covSpellOrName.iconId =
							covLinks[covSpellOrName.spellId];
					}
					if (covSpellOrName.notASpell) {
						return (
							<CustomTooltip
								key={covSpellOrName.spellId}
								placement={'top'}
								title={covSpellOrName.spellId}
							>
								<Grid item md={4} style={{ height: '45px' }}>
									<img
										alt=""
										style={{
											filter: `grayscale(${
												selectedCov !==
												spellsInfo.spellId
													? selectedCov === 'none'
														? 0
														: 100
													: 0
											}%)`,
											position: 'absolute',
											marginLeft: '-17px',
											marginTop: '3px',
										}}
										src={`https://wow.zamimg.com/images/wow/icons/medium/${covSpellOrName.iconId}.jpg`}
									/>
								</Grid>
							</CustomTooltip>
						);
					} else {
						return (
							<Grid
								key={covSpellOrName.spellId}
								item
								md={4}
								style={{ height: '45px' }}
							>
								<a
									data-wowhead={`spell=${covSpellOrName.spellId}`}
								>
									<img
										alt=""
										style={{
											filter: `grayscale(${
												selectedCov !==
												spellsInfo.spellId
													? selectedCov === 'none'
														? 0
														: 100
													: 0
											}%)`,
											position: 'absolute',
											marginLeft: '-17px',
											marginTop: '3px',
										}}
										src={`https://wow.zamimg.com/images/wow/icons/medium/${covSpellOrName.iconId}.jpg`}
									/>
								</a>
							</Grid>
						);
					}
				})}
			</Grid>
		</Grid>
	);
}

export default CovenantBox;
