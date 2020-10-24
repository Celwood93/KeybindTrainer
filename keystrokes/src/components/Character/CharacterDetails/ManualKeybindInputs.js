import React from 'react';
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

ManualKeybindInputs.propTypes = {
	spec: PropTypes.string.isRequired,
	invalidBind: PropTypes.array.isRequired,
	setInvalidBind: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	allKeybinds: PropTypes.array.isRequired,
	keybinding: PropTypes.object.isRequired,
	setKeybinding: PropTypes.func.isRequired,
	checkIfInvalidAndAdd: PropTypes.func.isRequired,
	Spells: PropTypes.object.isRequired,
};

function ManualKeybindInputs({
	spec,
	invalidBind,
	setInvalidBind,
	onSubmit,
	allKeybinds,
	keybinding,
	setKeybinding,
	checkIfInvalidAndAdd,
	Spells,
}) {
	const classes = styleGuide();

	function handleKeyPress(e) {
		if (!e.metaKey) {
			e.preventDefault();
		}
		const newKey = e.code.toLowerCase().replace(/digit|key/i, '');
		if (validatePress(newKey)) {
			setKeybinding({
				...keybinding,
				Key: verifyKey(newKey),
			});
		} else if (newKey === 'backspace' || newKey === 'delete') {
			setKeybinding({
				...keybinding,
				Key: '',
			});
		}
		checkIfInvalidAndAdd({
			...keybinding,
			Key: verifyKey(newKey),
		});
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
					id={'spell-selector'}
					variant="outlined"
					value={keybinding.Spell || ''}
					label="Spell"
					onChange={event => {
						setKeybinding({
							Spell: event.target.value,
							Target: null,
							Mod: null,
							Key: null,
						});
						setInvalidBind([]);
					}}
				>
					{Object.entries(Spells)
						.filter(spell => spell[1].spec.includes(spec))
						.map(spell => {
							const existingSpellBinds = allKeybinds.filter(
								bind => bind.Spell === spell[0]
							);
							return (
								<MenuItem
									key={spell[0]}
									id={`${spell[0].replace(/ /g, '')}-option`}
									value={spell[0]}
								>
									{keybinding.Spell !== spell[0] ? (
										<Grid
											container
											direction="row"
											justify="space-between"
										>
											<Grid item>{spell[0]}</Grid>
											<Grid item>
												<Tooltip
													placement="right-end"
													id={`${spell[0].replace(
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
																	{spell[0]}
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
															<React.Fragment>
																<Typography>{`No keybinds yet for ${spell[0]}!`}</Typography>
															</React.Fragment>
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
														id={`${spell[0].replace(
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
										spell[0]
									)}
								</MenuItem>
							);
						})}
				</TextField>
			</Grid>
			<Grid item className={classes.keybindingOptions}>
				<TextField
					className={classes.button}
					select={!!keybinding.Spell}
					disabled={!keybinding.Spell}
					id={'target-selector'}
					variant="outlined"
					value={keybinding.Target || ''}
					label="Target"
					onChange={event => {
						setKeybinding({
							...keybinding,
							Target: event.target.value,
						});
						checkIfInvalidAndAdd({
							...keybinding,
							Target: event.target.value,
						});
					}}
				>
					{keybinding.Spell &&
						targetting[Spells[keybinding.Spell].targetType].map(
							option => {
								const existingSpellBinds = allKeybinds.filter(
									bind => {
										return (
											bind.Spell === keybinding.Spell &&
											bind.Target === option
										);
									}
								);
								return (
									<MenuItem
										key={option}
										id={`${option.replace(
											/ /g,
											''
										)}-option`}
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
																<React.Fragment>
																	<Typography>
																		{`Already set for keybinding: ${existingSpellBinds &&
																			existingSpellBinds[0]
																				.Mod} ${existingSpellBinds &&
																			existingSpellBinds[0]
																				.Key}`}
																	</Typography>
																</React.Fragment>
															) : (
																<React.Fragment>
																	<Typography>{`Not set for ${keybinding.Spell}!`}</Typography>
																</React.Fragment>
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
							}
						)}
				</TextField>
			</Grid>
			<Grid item className={classes.keybindingOptions}>
				<TextField
					className={classes.button}
					select
					id={'modifier-selector'}
					disabled={!keybinding.Spell}
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
					disabled={!keybinding.Spell}
					variant="outlined"
					id={'keystroke-selector'}
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
						!keybinding.Spell ||
						!keybinding.Target
					}
					variant="contained"
					size="large"
					onClick={onSubmit}
				>
					Enter
				</Button>
			</Grid>
			{invalidBind.length ? (
				<Tooltip
					placement="right-end"
					id={'Invalid-bind-warning-popup'}
					title={
						<React.Fragment>
							<Typography>Conflicting Keybindings:</Typography>
							<ul>
								{invalidBind.map(bind => (
									<li key={bind.Target + bind.Spell}>
										<Typography>{`${bind.Spell} ${bind.Target} ${bind.Mod} ${bind.Key}`}</Typography>
									</li>
								))}
							</ul>
						</React.Fragment>
					}
				>
					<WarningIcon
						id={'Invalid-bind-warning'}
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
