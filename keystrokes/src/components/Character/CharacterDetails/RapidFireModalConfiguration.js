import React, { useState, useEffect, Fragment } from 'react';
import { Grid, Typography, Tooltip, Button } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import { targettingDetails, targetting } from '../../../config/constants';
import { sortBy } from 'lodash';
import update from 'immutability-helper';
import PropTypes from 'prop-types';
import DetailedDropdownConfig from './DetailedDropdownConfig';

RapidFireModalConfiguration.propTypes = {
	formattedSpells: PropTypes.array.isRequired,
	spellTargetOpts: PropTypes.object, //this starts out as undefined
	setSpellTargetOpts: PropTypes.func.isRequired,
	closeInConf: PropTypes.func.isRequired,
	finishConf: PropTypes.func.isRequired,
};

function RapidFireModalConfiguration({
	formattedSpells,
	spellTargetOpts,
	setSpellTargetOpts,
	closeInConf,
	finishConf,
}) {
	const [targettingOpts, setTargettingOpts] = useState();

	useEffect(() => {
		resetFilter();
	}, [formattedSpells]);

	function resetFilter() {
		setTargettingOpts(createTargetOptsBaseline());
		setSpellTargetOpts(createSpellTargetOptsBaseline());
	}

	function createTargetOptsBaseline() {
		let targetOpts = {};
		Object.keys(targettingDetails).forEach(targetType =>
			targetting[targetType].forEach(targetSubType => {
				targetOpts[[targetType, targetSubType]] = true;
			})
		);
		return targetOpts;
	}
	//removes target options that dont exist in spells
	function createTargetDetails() {
		return Object.keys(targettingDetails).filter(targetType =>
			formattedSpells.some(spell => spell.targetType === targetType)
		);
	}

	function createSpellTargetOptsBaseline() {
		let spellTargettingOpts = {};
		formattedSpells.forEach(spellDetails =>
			targetting[spellDetails.targetType].forEach(targetSubType => {
				spellTargettingOpts[
					[
						spellDetails.spellId,
						spellDetails.targetType,
						targetSubType,
					]
				] = true;
			})
		);
		return spellTargettingOpts;
	}

	function handleOptionChange(targetType, option) {
		const val = [targetType, option];
		setTargettingOpts(
			update(targettingOpts, {
				[val]: { $set: !targettingOpts[val] },
			})
		);
		const filterSpellsTar = Object.keys(spellTargetOpts).filter(
			spellTars =>
				spellTars.split(',')[2] === option &&
				spellTars.split(',')[1] === targetType
		);
		let updateSpellChanges = {};
		filterSpellsTar.forEach(item => {
			const spellVal = item.split(',');
			updateSpellChanges[spellVal] = { $set: !targettingOpts[val] };
		});
		setSpellTargetOpts(update(spellTargetOpts, updateSpellChanges));
	}

	function handleOptionCheckBoxClick(targetType) {
		const changeTo = targetting[targetType].some(option => {
			return targettingOpts[[targetType, option]];
		});
		let updateSpellChanges = {};
		let updateTargettingChanges = {};
		targetting[targetType].forEach(option => {
			const val = [targetType, option];
			updateTargettingChanges[val] = { $set: !changeTo };
			const filterSpellsTar = Object.keys(spellTargetOpts).filter(
				spellTars =>
					spellTars.split(',')[2] === option &&
					spellTars.split(',')[1] === targetType
			);
			filterSpellsTar.forEach(item => {
				const val = item.split(',');
				updateSpellChanges[val] = { $set: !changeTo };
			});
		});
		setTargettingOpts(update(targettingOpts, updateTargettingChanges));
		setSpellTargetOpts(update(spellTargetOpts, updateSpellChanges));
	}

	function handleSpellCheckBoxClick(spellTargetKey) {
		let updateSpellChanges = {};
		const filterSpellsTar = Object.keys(spellTargetOpts).filter(
			spellTars => spellTars.split(',')[0] === spellTargetKey
		);
		const changeTo = filterSpellsTar.some(spellTar => {
			return spellTargetOpts[spellTar.split(',')];
		});
		filterSpellsTar.forEach(item => {
			const val = item.split(',');
			updateSpellChanges[val] = { $set: !changeTo };
		});
		setSpellTargetOpts(update(spellTargetOpts, updateSpellChanges));
	}

	function handleSpellOptionChange(spellDetails, targetType, option) {
		const val = [spellDetails.spellId, targetType, option];
		setSpellTargetOpts(
			update(spellTargetOpts, {
				[val]: { $set: !spellTargetOpts[val] },
			})
		);
	}
	return (
		<Fragment>
			<Grid container justify="space-between">
				<Grid item>
					<Button
						color="secondary"
						variant="contained"
						onClick={closeInConf}
						size="large"
					>
						Cancel
					</Button>
				</Grid>
				<Grid item>
					<Button
						color="primary"
						variant="contained"
						size="large"
						onClick={finishConf}
					>
						Start Rapid Fire
					</Button>
				</Grid>
			</Grid>
			<Grid
				direction="row"
				container
				justify="space-evenly"
				alignItems="center"
			>
				<Typography id={'preset-config-label'} variant="button">
					Preset Configurations
				</Typography>{' '}
				<Button
					id={'reset-config-button'}
					variant="contained"
					size="small"
					onClick={resetFilter}
				>
					Reset
				</Button>
			</Grid>
			<Grid container direction="row" justify="center">
				{createTargetDetails()
					.sort()
					.map(targetType => (
						<DetailedDropdownConfig
							key={targetType}
							name={targettingDetails[targetType].name}
							checkedKey={[targetType]}
							targetType={targetType}
							targettingOptions={targettingOpts}
							handleChange={(targetType, option) => {
								handleOptionChange(targetType, option);
							}}
							handleCheckboxClick={targetType => {
								handleOptionCheckBoxClick(targetType);
							}}
							additionalDetails={
								<Tooltip
									title={
										targettingDetails[targetType].tooltip
									}
								>
									<HelpIcon
										style={{
											maxWidth: '15px',
											position: 'relative',
											top: '8px',
										}}
									/>
								</Tooltip>
							}
						/>
					))}
			</Grid>
			<hr style={{ borderTop: '3px solid #bbb' }} />
			<Grid
				container
				spacing={3}
				style={{ overflowY: 'auto', maxHeight: '80%' }}
			>
				{sortBy(formattedSpells, ['targetType', 'spellName']).map(
					spellDetails => (
						<Grid key={spellDetails.spellId} item md={4}>
							<DetailedDropdownConfig
								name={spellDetails.spellName}
								checkedKey={[
									spellDetails.spellId,
									spellDetails.targetType,
								]}
								targetType={spellDetails.targetType}
								targettingOptions={spellTargetOpts}
								handleChange={(targetType, option) => {
									handleSpellOptionChange(
										spellDetails,
										targetType,
										option
									);
								}}
								handleCheckboxClick={targetType => {
									handleSpellCheckBoxClick(
										spellDetails.spellId
									);
								}}
								additionalDetails={
									<a
										data-wowhead={`https://www.wowhead.com/spell=${spellDetails.spellId}`}
										style={{ cursor: 'default' }}
									>
										<img
											src={`https://wow.zamimg.com/images/wow/icons/medium/${spellDetails.iconId}.jpg`}
											alt=""
											style={{
												maxHeight: '24px',
												position: 'relative',
												top: '8px',
											}}
										/>
									</a>
								}
							/>
						</Grid>
					)
				)}
			</Grid>
		</Fragment>
	);
}

export default RapidFireModalConfiguration;
