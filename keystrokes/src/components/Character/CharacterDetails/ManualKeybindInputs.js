import React, { useContext } from 'react';
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
import styleGuide from '../../../stylesheets/style';
import { verifyKey, validatePress } from '../../utils/utils';
import { targetting, mods } from '../../../config/constants';
import { AllSpellsContext } from '../../../contexts/AllSpellsContext';

ManualKeybindInputs.propTypes = {
	spec: PropTypes.string.isRequired,
	invalidBinds: PropTypes.array.isRequired,
	setInvalidBinds: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	allKeybinds: PropTypes.array.isRequired,
	keybinding: PropTypes.object.isRequired,
	setKeybinding: PropTypes.func.isRequired,
	checkIfInvalidAndAdd: PropTypes.func.isRequired,
	Spells: PropTypes.array.isRequired,
};

function ManualKeybindInputs({
	spec,
	invalidBinds,
	setInvalidBinds,
	onSubmit,
	allKeybinds,
	keybinding,
	setKeybinding,
	checkIfInvalidAndAdd,
	Spells,
}) {
	const classes = styleGuide();
	const allSpells = useContext(AllSpellsContext);

	function handleKeyPress(e) {
		if (!e.metaKey) {
			e.preventDefault();
		}
		const newKey = e.code.toLowerCase().replace(/digit|key/i, '');
		if (validatePress(newKey)) {
			const newKeybinding = {
				...keybinding,
				Key: verifyKey(newKey),
			};
			setKeybinding(newKeybinding);
			checkIfInvalidAndAdd(newKeybinding);
		}
	}

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
					value={keybinding.SpellId || ''}
					label="Spell"
					onChange={event => {
						console.log(event);
						setKeybinding({
							SpellId: event.target.value,
							Target: null,
							Mod: null,
							Key: null,
						});
						setInvalidBinds([]);
					}}
				>
					{/*Going to have to change this to account for talents/covenants/racials*/
					Spells.map(e => allSpells[e])
						.filter(spell => spell.spec.includes(spec))
						.map(spell => {
							const existingSpellBinds = allKeybinds.filter(
								bind => bind.SpellId === spell.spellId
							);
							return (
								<MenuItem
									key={spell.spellId}
									id={`${spell.spellName.replace(
										/ /g,
										''
									)}-option`}
									value={spell.spellId}
								>
									{keybinding.SpellId !== spell.spellId ? (
										<Grid
											container
											direction="row"
											justify="space-between"
										>
											<Grid item>{spell.spellName}</Grid>
											<Grid item>
												<Tooltip
													placement="right-end"
													id={`${spell.spellName.replace(
														/ /g,
														''
													)}-popup`}
													title={
														existingSpellBinds &&
														existingSpellBinds.length ? (
															<React.Fragment>
																<Typography>
																	Current
																	keybinds for{' '}
																	{
																		spell.spellName
																	}
																</Typography>
																<ul>
																	{existingSpellBinds.map(
																		bind => (
																			<li
																				key={
																					bind.Target
																				}
																			>
																				<Typography>{`${bind.Target} ${bind.Mod} ${bind.Key}`}</Typography>
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
															/ /g,
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
					select={!!keybinding.SpellId}
					disabled={!keybinding.SpellId}
					id="target-selector"
					variant="outlined"
					value={keybinding.Target || ''}
					label="Target"
					onChange={event => {
						const keybindingUpdates = {
							...keybinding,
							Target: event.target.value,
						};
						setKeybinding(keybindingUpdates);
						checkIfInvalidAndAdd(keybindingUpdates);
					}}
				>
					{keybinding.SpellId &&
						targetting[
							allSpells[keybinding.SpellId].targetType
						].map(option => {
							const existingSpellBinds = allKeybinds.filter(
								bind =>
									bind.SpellId === keybinding.SpellId &&
									bind.Target === option
							);
							return (
								<MenuItem
									key={option}
									id={`${option.replace(/ /g, '')}-option`}
									value={option}
								>
									{keybinding.Target !== option ? (
										<Grid
											container
											direction="row"
											justify="space-between"
										>
											<Grid item>{option}</Grid>
											<Grid item>
												<Tooltip
													id={`${option.replace(
														/ /g,
														''
													)}-popup`}
													title={
														existingSpellBinds &&
														existingSpellBinds.length ? (
															<Typography>
																{`Already set for keybinding: ${existingSpellBinds &&
																	existingSpellBinds[0]
																		.Mod} ${existingSpellBinds &&
																	existingSpellBinds[0]
																		.Key}`}
															</Typography>
														) : (
															<Typography>{`Not set for ${
																allSpells[
																	keybinding
																		.SpellId
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
															/ /g,
															''
														)}-status`}
													>
														<Typography variant="subtitle2">
															{' '}
														</Typography>
													</Avatar>
												</Tooltip>
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
					disabled={!keybinding.SpellId}
					variant="outlined"
					value={keybinding.Mod || ''}
					label="Mod"
					onChange={event => {
						setKeybinding({
							...keybinding,
							Mod: event.target.value,
						});
						checkIfInvalidAndAdd({
							...keybinding,
							Mod: event.target.value,
						});
					}}
				>
					{mods.map(option => (
						<MenuItem
							key={option}
							value={option}
							id={`${option.replace(/ /g, '')}-option`}
						>
							{option}
						</MenuItem>
					))}
				</TextField>
			</Grid>
			<Grid item className={classes.keybindingOptions}>
				<TextField
					className={classes.button}
					disabled={!keybinding.SpellId}
					variant="outlined"
					id="keystroke-selector"
					value={keybinding.Key || ''}
					label="Key"
					onFocus={() => {
						document.body.onkeydown = handleKeyPress;
					}}
					onBlur={() => {
						document.body.onkeydown = null;
					}}
				/>
			</Grid>
			<Grid item className={classes.keybindingOptions}>
				<Button
					className={classes.button}
					color="primary"
					disabled={
						!keybinding.Key ||
						!keybinding.Mod ||
						!keybinding.SpellId ||
						!keybinding.Target
					}
					variant="contained"
					size="large"
					onClick={onSubmit}
				>
					Enter
				</Button>
			</Grid>
			{invalidBinds.length ? (
				<Tooltip
					placement="right-end"
					id="Invalid-bind-warning-popup"
					title={
						<React.Fragment>
							<Typography>Conflicting Keybindings:</Typography>
							<ul>
								{invalidBinds.map(bind => (
									<li key={bind.Target + bind.SpellId}>
										<Typography>{`${
											allSpells[bind.SpellId].spellName
										} ${bind.Target} ${bind.Mod} ${
											bind.Key
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
