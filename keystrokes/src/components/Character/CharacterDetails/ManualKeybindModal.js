import React, { useState, useEffect } from 'react';
import { Modal, Button, Grid, Typography } from '@material-ui/core';
import update from 'immutability-helper';
import PropTypes from 'prop-types';
import KeybindTable from './KeybindTable';
import ManualKeybindInputs from './ManualKeybindInputs';
import styleGuide from '../../../stylesheets/style';
import { ref, characterDetails } from '../../../config/constants';

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

	function checkIfInvalidAndAdd(currKeybinding) {
		setInvalidBind(
			allKeybinds.filter(
				bind =>
					!('delete' in bind) &&
					((bind.Key === currKeybinding.Key &&
						bind.Mod === currKeybinding.Mod) ||
						(bind.Spell === currKeybinding.Spell &&
							bind.Target === currKeybinding.Target))
			)
		);
	}

	function deleteThisRow(row) {
		setAllKeybinds(
			allKeybinds.filter(
				bind => JSON.stringify(bind) !== JSON.stringify(row)
			)
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
				...allKeybinds.filter(bind => !('delete' in bind)),
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
								<ul id={'warning-modal-items'}>
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
										setInvalidBind([]);
										setEditingKey();
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
						<ManualKeybindInputs
							spec={spec}
							invalidBind={invalidBind}
							setInvalidBind={setInvalidBind}
							onSubmit={onSubmit}
							allKeybinds={allKeybinds}
							keybinding={keybinding}
							setKeybinding={setKeybinding}
							checkIfInvalidAndAdd={checkIfInvalidAndAdd}
							Spells={Spells}
						/>
						<KeybindTable
							allKeybinds={allKeybinds}
							editing={true}
							editingKey={editingKey}
							editThisRow={editThisRow}
							deleteThisRow={deleteThisRow}
						/>
					</React.Fragment>
				)}
			</div>
		</Modal>
	);
}

export default ManualKeybindModal;
