import React, { useContext, useState, useEffect } from 'react';
import { red } from '@material-ui/core/colors';
import {
	Tooltip,
	Button,
	Grid,
	TextField,
	Typography,
	MenuItem,
	Avatar,
} from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import PropTypes from 'prop-types';
import { removeLingeringPopups } from '../../utils/toolTipHooks';
import styleGuide from '../../../stylesheets/style';
import { verifyKey, validatePress } from '../../utils/utils';
import { targetting, mods } from '../../../config/constants';
import { AllSpellsContext } from '../../../contexts/AllSpellsContext';

ManualKeybindInputs.propTypes = {
	invalidBinds: PropTypes.array.isRequired,
	setInvalidBinds: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	allKeybinds: PropTypes.array.isRequired,
	keybinding: PropTypes.object.isRequired,
	setKeybinding: PropTypes.func.isRequired,
	checkIfInvalidAndAdd: PropTypes.func.isRequired,
	formattedSpells: PropTypes.array.isRequired,
};

function ManualKeybindInputs({
	invalidBinds,
	setInvalidBinds,
	onSubmit,
	allKeybinds,
	keybinding,
	setKeybinding,
	checkIfInvalidAndAdd,
	formattedSpells,
}) {
	const classes = styleGuide();
	const allSpells = useContext(AllSpellsContext);
	const [targetOptions, setTargetOptions] = useState(targetting['ALL']);
	const [formattedClassSpells, setFormattedClassSpells] = useState(
		formattedSpells
	);

	function handleKeyPress(e) {
		if (!e.metaKey) {
			e.preventDefault();
		}
		let newKey;
		try {
			newKey = e.code.toLowerCase().replace(/digit|key/i, '');
		} catch (e) {
			return;
		}
		if (validatePress(newKey)) {
			const newKeybinding = {
				...keybinding,
				key: verifyKey(newKey),
			};
			setKeybinding(newKeybinding);
			checkIfInvalidAndAdd(newKeybinding);
		}
	}

	useEffect(() => {
		if (!!keybinding.spellId) {
			setTargetOptions(
				targetting[allSpells[keybinding.spellId].targetType]
			);
		}
		if (keybinding.target) {
			setFormattedClassSpells(
				formattedSpells.filter(spell => {
					return targetting[
						allSpells[spell.spellId].targetType
					].includes(keybinding.target);
				})
			);
		}
	}, [keybinding]);

	return (
		<Grid
			container
			className={classes.paddingTop}
			justify="center"
			alignItems="center"
		>
			<Grid item className={classes.keybindingOptions}>
				<TextField
					className={classes.button}
					select
					id="spell-selector"
					variant="outlined"
					value={keybinding.spellId || ''}
					label="Spell"
					onChange={event => {
						setKeybinding({
							...keybinding,
							spellId: event.target.value,
							mod: null,
							key: null,
						});
						setInvalidBinds([]);
						removeLingeringPopups();
					}}
				>
					{/*Going to have to change this to account for talents/covenants/racials*/
					formattedClassSpells.map(spell => {
						const existingSpellBinds = allKeybinds.filter(
							bind => bind.spellId === spell.spellId
						);
						return (
							<MenuItem
								key={spell.spellId}
								id={`${spell.spellName.replace(
									/ |:|'/g,
									''
								)}-option`}
								value={spell.spellId}
							>
								{keybinding.spellId !== spell.spellId ? (
									<Grid
										container
										direction="row"
										justify="space-between"
									>
										<Grid>
											<a
												data-wowhead={`https://www.wowhead.com/spell=${spell.spellId}`}
												style={{ cursor: 'default' }}
											>
												<img
													src={`https://wow.zamimg.com/images/wow/icons/medium/${spell.iconId}.jpg`}
													alt=""
													style={{
														maxHeight: '24px',
													}}
												/>
											</a>
										</Grid>
										<Grid item>{spell.spellName}</Grid>
										<Grid item>
											<Tooltip
												placement="right-end"
												id={`${spell.spellName.replace(
													/ |:|'/g,
													''
												)}-popup`}
												title={
													existingSpellBinds &&
													existingSpellBinds.length ? (
														<React.Fragment>
															<Typography>
																Current keybinds
																for{' '}
																{
																	spell.spellName
																}
															</Typography>
															<ul>
																{existingSpellBinds.map(
																	bind => (
																		<li
																			key={
																				bind.target
																			}
																		>
																			<Typography>{`${bind.target} ${bind.mod} ${bind.key}`}</Typography>
																		</li>
																	)
																)}
															</ul>
														</React.Fragment>
													) : (
														<Typography>{`No keybinds yet for ${spell.spellName}!`}</Typography>
													)
												}
											>
												<Avatar
													className={
														existingSpellBinds &&
														existingSpellBinds.length
															? classes.keybindsComplete
															: classes.keybindsIncomplete
													}
													id={`${spell.spellName.replace(
														/ |:|'/g,
														''
													)}-status`}
												>
													<Typography variant="subtitle2">
														{existingSpellBinds &&
															existingSpellBinds.length}
													</Typography>
												</Avatar>
											</Tooltip>
										</Grid>
									</Grid>
								) : (
									spell.spellName
								)}
							</MenuItem>
						);
					})}
				</TextField>
			</Grid>
			<Grid item className={classes.keybindingOptions}>
				<TextField
					className={classes.button}
					select={true}
					id="target-selector"
					variant="outlined"
					value={keybinding.target || ''}
					label="Target"
					onChange={event => {
						const keybindingUpdates = {
							...keybinding,
							target: event.target.value,
						};
						setKeybinding(keybindingUpdates);
						checkIfInvalidAndAdd(keybindingUpdates);
					}}
				>
					{targetOptions.map(option => {
						const existingSpellBinds = allKeybinds.filter(
							bind =>
								bind.spellId === keybinding.spellId &&
								bind.target === option
						);
						return (
							<MenuItem
								key={option}
								id={`${option.replace(/ |:|'/g, '')}-option`}
								value={option}
							>
								{keybinding.target !== option ? (
									<Grid
										container
										direction="row"
										justify="space-between"
									>
										<Grid item>{option}</Grid>

										<Grid item>
											{keybinding.spellId ? (
												<Tooltip
													id={`${option.replace(
														/ |:|'/g,
														''
													)}-popup`}
													title={
														existingSpellBinds &&
														existingSpellBinds.length ? (
															<Typography>
																{`Already set for keybinding: ${existingSpellBinds &&
																	existingSpellBinds[0]
																		.mod} ${existingSpellBinds &&
																	existingSpellBinds[0]
																		.key}`}
															</Typography>
														) : (
															<Typography>{`Not set for ${
																allSpells[
																	keybinding
																		.spellId
																].spellName
															}!`}</Typography>
														)
													}
													placement="right-end"
												>
													<Avatar
														className={
															existingSpellBinds &&
															existingSpellBinds.length
																? classes.keybindsTargetComplete
																: classes.keybindsTargetIncomplete
														}
														id={`${option.replace(
															/ |:|'/g,
															''
														)}-status`}
													>
														<Typography variant="subtitle2">
															{' '}
														</Typography>
													</Avatar>
												</Tooltip>
											) : (
												<span></span>
											)}
										</Grid>
									</Grid>
								) : (
									option
								)}
							</MenuItem>
						);
					})}
				</TextField>
			</Grid>
			<Grid item className={classes.keybindingOptions}>
				<TextField
					className={classes.button}
					select
					id="modifier-selector"
					disabled={!keybinding.spellId}
					variant="outlined"
					value={keybinding.mod || ''}
					label="Mod"
					onChange={event => {
						setKeybinding({
							...keybinding,
							mod: event.target.value,
						});
						checkIfInvalidAndAdd({
							...keybinding,
							mod: event.target.value,
						});
					}}
				>
					{mods.map(option => (
						<MenuItem
							key={option}
							value={option}
							id={`${option.replace(/ |:|'/g, '')}-option`}
						>
							{option}
						</MenuItem>
					))}
				</TextField>
			</Grid>
			<Grid item className={classes.keybindingOptions}>
				<TextField
					className={classes.button}
					disabled={!keybinding.spellId}
					variant="outlined"
					id="keystroke-selector"
					value={keybinding.key || ''}
					label="Key"
					onFocus={() => {
						document.body.onkeydown = handleKeyPress;
						document.body.onmousedown = event => {
							if (event.which === 2 && event.button === 1) {
								handleKeyPress({
									preventDefault: () => {},
									code: 'wheelclick',
								});
							}
						};
						document.body.onmousewheel = event => {
							if (event.deltaY > 0) {
								handleKeyPress({
									preventDefault: () => {},
									code: 'wheeldown',
								});
							} else {
								handleKeyPress({
									preventDefault: () => {},
									code: 'wheelup',
								});
							}
						};
					}}
					onBlur={() => {
						document.body.onkeydown = null;
						document.body.onmousedown = null;
						document.body.onmousewheel = null;
					}}
				/>
			</Grid>
			<Grid item className={classes.keybindingOptions}>
				<Button
					className={classes.button}
					color="primary"
					disabled={
						!keybinding.key ||
						!keybinding.mod ||
						!keybinding.spellId ||
						!keybinding.target
					}
					variant="contained"
					size="large"
					onClick={() => {
						setFormattedClassSpells(formattedSpells);
						onSubmit();
					}}
				>
					Enter
				</Button>
			</Grid>
			{invalidBinds.filter(bind => !bind.disabled).length ? (
				<Tooltip
					placement="right-end"
					id="Invalid-bind-warning-popup"
					title={
						<React.Fragment>
							<Typography>Conflicting Keybindings:</Typography>
							<ul>
								{invalidBinds.map(bind => (
									<li key={bind.target + bind.spellId}>
										<Typography>{`${
											allSpells[bind.spellId].spellName
										} ${bind.target} ${bind.mod} ${
											bind.key
										}`}</Typography>
									</li>
								))}
							</ul>
						</React.Fragment>
					}
				>
					<WarningIcon
						id="Invalid-bind-warning"
						style={{ color: red[500] }}
					/>
				</Tooltip>
			) : (
				<div />
			)}
		</Grid>
	);
}

export default ManualKeybindInputs;
