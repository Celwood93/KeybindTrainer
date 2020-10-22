import React, { useState, useEffect } from 'react';
import { red } from '@material-ui/core/colors';
import {
	Modal,
	Tooltip,
	Button,
	Grid,
	TextField,
	Typography,
	MenuItem,
	Avatar,
} from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';
import update from 'immutability-helper';
import PropTypes from 'prop-types';
import KeybindTable from './KeybindTable';
import styleGuide from '../../../stylesheets/style';
import { verifyKey, validatePress } from '../../utils/utils';
import {
	ref,
	targetting,
	mods,
	characterDetails,
} from '../../../config/constants';

ManualKeybindModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
	characterClass: PropTypes.string.isRequired,
	characterSpec: PropTypes.number.isRequired,
	setAllKeybindings: PropTypes.func.isRequired,
	markAsConfigured: PropTypes.func.isRequired,
	allKeybindings: PropTypes.object.isRequired,
	keyBindingKey: PropTypes.string.isRequired,
};

function ManualKeybindModal({
	isOpen,
	setIsOpen,
	markAsConfigured,
	characterClass,
	characterSpec,
	setAllKeybindings,
	allKeybindings,
	keyBindingKey,
}) {
	const classes = styleGuide();
	const [keybinding, setKeybinding] = useState({
		Spell: null,
		Target: null,
		Mod: null,
		Key: null,
	});
	const [allKeybinds, setAllKeybinds] = useState([]);
	const [loading, setLoading] = useState(true);
	const [Spells, setSpells] = useState();
	const [editingKey, setEditingKey] = useState();
	const [invalidBind, setInvalidBind] = useState([]);
	const [isKBConflictOpen, setIsKBConflictOpen] = useState(false);
	const spec = characterDetails.class[characterClass][
		characterSpec
	].toUpperCase();

	useEffect(() => {
		if (allKeybindings[keyBindingKey]) {
			setAllKeybinds(allKeybindings[keyBindingKey]);
		}
	}, [allKeybindings]);

	useEffect(() => {
		async function getSpells() {
			try {
				const snapShot = await ref
					.child(`/Spells/${characterClass}`)
					.once('value');
				if (snapShot.exists()) {
					setSpells(snapShot.val());
					setLoading(false);
				}
			} catch (e) {
				console.error(`failed to get spells for ${characterClass}`);
			}
		}
		getSpells();
	}, [characterClass]);

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

	function checkIfInvalidAndAdd(currKeybinding) {
		setInvalidBind(
			allKeybinds.filter(bind => {
				return (
					!('delete' in bind) &&
					((bind.Key === currKeybinding.Key &&
						bind.Mod === currKeybinding.Mod) ||
						(bind.Spell === currKeybinding.Spell &&
							bind.Target === currKeybinding.Target))
				);
			})
		);
	}

	function deleteThisRow(row) {
		setAllKeybinds(
			allKeybinds.filter(bind => {
				return JSON.stringify(bind) !== JSON.stringify(row);
			})
		);
	}

	function editThisRow(row) {
		if (editingKey === row.Spell + row.Target) {
			setKeybinding({
				Spell: null,
				Target: null,
				Mod: null,
				Key: null,
			});
			delete row.delete;
			setEditingKey();
		} else {
			setEditingKey(row.Spell + row.Target);
			row['delete'] = false;
			setKeybinding({
				Key: row.Key,
				Mod: row.Mod,
				Spell: row.Spell,
				Target: row.Target,
			});
		}
	}

	function onSubmit() {
		if (invalidBind.length > 0) {
			setIsKBConflictOpen(true);
		} else {
			setAllKeybinds([
				keybinding,
				...allKeybinds.filter(bind => {
					return !('delete' in bind);
				}),
			]);
			setEditingKey();
			setKeybinding({
				Spell: null,
				Target: null,
				Mod: null,
				Key: null,
			});
		}
	}

	return (
		<Modal open={isOpen} onClose={() => {}} className={classes.modal}>
			<div className={classes.manualModalBackground}>
				{loading ? (
					<div>Loading</div>
				) : (
					<React.Fragment>
						<Modal
							open={isKBConflictOpen}
							onClose={() => {}}
							className={classes.modal}
						>
							<div className={classes.keybindingConflictModal}>
								<Typography>
									The following keybinds will be deleted:{' '}
								</Typography>
								<ul>
									{invalidBind.map(bind => (
										<li key={bind.Target}>
											<Typography>{`${bind.Spell} ${bind.Target} ${bind.Mod} ${bind.Key}`}</Typography>
										</li>
									))}
								</ul>

								<Grid container justify="space-between">
									<Grid item>
										<Button
											color="secondary"
											variant="contained"
											onClick={() => {
												setIsKBConflictOpen(false);
											}}
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
											onClick={() => {
												setAllKeybinds([
													keybinding,
													...allKeybinds.filter(
														bind => {
															let dontFilterBind = true;
															for (
																let i = 0;
																i <
																invalidBind.length;
																i++
															) {
																dontFilterBind =
																	dontFilterBind &&
																	!(
																		bind.Spell ===
																			invalidBind[
																				i
																			]
																				.Spell &&
																		bind.Target ===
																			invalidBind[
																				i
																			]
																				.Target
																	);
															}

															dontFilterBind =
																dontFilterBind &&
																!(
																	'delete' in
																	bind
																);

															return dontFilterBind;
														}
													),
												]);
												setInvalidBind([]);
												setEditingKey();
												setKeybinding({
													Spell: null,
													Target: null,
													Mod: null,
													Key: null,
												});
												//close modal
												setIsKBConflictOpen(false);
											}}
										>
											Confirm
										</Button>
									</Grid>
								</Grid>
							</div>
						</Modal>
						<Grid container justify="space-between">
							<Grid item>
								<Button
									color="secondary"
									variant="contained"
									onClick={() => {
										setKeybinding({
											Spell: null,
											Target: null,
											Mod: null,
											Key: null,
										});
										setAllKeybinds(
											allKeybindings[keyBindingKey]
										);
										setIsOpen(false);
									}}
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
									onClick={() => {
										setAllKeybindings(
											update(allKeybindings, {
												[keyBindingKey]: {
													$set: allKeybinds,
												},
											})
										);
										if (allKeybinds.length > 0) {
											markAsConfigured();
										}
										setAllKeybinds(
											allKeybindings[keyBindingKey]
										);
										setIsOpen(false);
									}}
								>
									Apply
								</Button>
							</Grid>
						</Grid>
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
										.filter(spell =>
											spell[1].spec.includes(spec)
										)
										.map(spell => {
											const existingSpellBinds = allKeybinds.filter(
												bind => bind.Spell === spell[0]
											);
											return (
												<MenuItem
													key={spell[0]}
													id={`${spell[0].replace(
														/ /g,
														''
													)}-option`}
													value={spell[0]}
												>
													{keybinding.Spell !==
													spell[0] ? (
														<Grid
															container
															direction="row"
															justify="space-between"
														>
															<Grid item>
																{spell[0]}
															</Grid>
															<Grid item>
																<Tooltip
																	placement="right-end"
																	title={
																		existingSpellBinds &&
																		existingSpellBinds.length ? (
																			<React.Fragment>
																				<Typography>
																					Current
																					keybinds
																					for{' '}
																					{
																						spell[0]
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
										targetting[
											Spells[keybinding.Spell].targetType
										].map(option => {
											const existingSpellBinds = allKeybinds.filter(
												bind => {
													return (
														bind.Spell ===
															keybinding.Spell &&
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
													{keybinding.Target !==
													option ? (
														<Grid
															container
															direction="row"
															justify="space-between"
														>
															<Grid item>
																{option}
															</Grid>
															<Grid item>
																<Tooltip
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
											id={`${option.replace(
												/ /g,
												''
											)}-option`}
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
									title={
										<React.Fragment>
											<Typography>
												Conflicting Keybindings:
											</Typography>
											<ul>
												{invalidBind.map(bind => (
													<li
														key={
															bind.Target +
															bind.Spell
														}
													>
														<Typography>{`${bind.Spell} ${bind.Target} ${bind.Mod} ${bind.Key}`}</Typography>
													</li>
												))}
											</ul>
										</React.Fragment>
									}
								>
									<WarningIcon style={{ color: red[500] }} />
								</Tooltip>
							) : (
								<div />
							)}
						</Grid>
						{keyBindingKey && allKeybindings[keyBindingKey] && (
							<KeybindTable
								allKeybinds={allKeybinds}
								editing={true}
								editingKey={editingKey}
								editThisRow={editThisRow}
								deleteThisRow={deleteThisRow}
							/>
						)}
					</React.Fragment>
				)}
			</div>
		</Modal>
	);
}

export default ManualKeybindModal;
