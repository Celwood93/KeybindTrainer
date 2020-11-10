import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Grid, Typography } from '@material-ui/core';
import update from 'immutability-helper';
import PropTypes from 'prop-types';
import KeybindTable from './KeybindTable';
import ManualKeybindInputs from './ManualKeybindInputs';
import styleGuide from '../../../stylesheets/style';
import { ref, characterDetails } from '../../../config/constants';
import { AllSpellsContext } from '../../../contexts/AllSpellsContext';

ManualKeybindModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
	characterClass: PropTypes.string.isRequired,
	characterSpec: PropTypes.number.isRequired,
	setAllKeybindings: PropTypes.func.isRequired,
	allKeybindings: PropTypes.object.isRequired,
	keyBindingKey: PropTypes.string.isRequired,
};

function ManualKeybindModal({
	isOpen,
	setIsOpen,
	characterClass,
	characterSpec,
	setAllKeybindings,
	allKeybindings,
	keyBindingKey,
}) {
	const classes = styleGuide();
	const allSpells = useContext(AllSpellsContext);
	const [keybinding, setKeybinding] = useState({
		SpellId: null,
		Target: null,
		Mod: null,
		Key: null,
	});
	const [allKeybinds, setAllKeybinds] = useState([]);
	const [loading, setLoading] = useState(true);
	const [Spells, setSpells] = useState();
	const [editingKey, setEditingKey] = useState();
	const [invalidBinds, setInvalidBinds] = useState([]);
	const [isKBConflictOpen, setIsKBConflictOpen] = useState(false);
	const spec = characterDetails.class[characterClass][
		characterSpec
	].toUpperCase();
	useEffect(() => {
		if (allKeybindings[keyBindingKey]) {
			setAllKeybinds(allKeybindings[keyBindingKey]);
		}
	}, [allKeybindings, keyBindingKey]);

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
		setInvalidBinds(
			allKeybinds.filter(
				bind =>
					!('delete' in bind) &&
					((bind.Key === currKeybinding.Key &&
						bind.Mod === currKeybinding.Mod) ||
						(bind.SpellId === currKeybinding.SpellId &&
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
		if (editingKey === row.SpellId + row.Target) {
			setKeybinding({
				SpellId: null,
				Target: null,
				Mod: null,
				Key: null,
			});
			delete row.delete;
			setEditingKey();
		} else {
			setEditingKey(row.SpellId + row.Target);
			row['delete'] = false;
			setKeybinding({
				Key: row.Key,
				Mod: row.Mod,
				SpellId: row.SpellId,
				Target: row.Target,
			});
		}
	}

	function onSubmit() {
		if (invalidBinds.length > 0) {
			setIsKBConflictOpen(true);
		} else {
			setAllKeybinds([
				keybinding,
				...allKeybinds.filter(bind => !('delete' in bind)),
			]);
			setEditingKey();
			setKeybinding({
				SpellId: null,
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
								<ul id="warning-modal-items">
									{invalidBinds
										.map(e => ({
											...allSpells[e.SpellId],
											...e,
										}))
										.map(bind => (
											<li key={bind.Target}>
												<Typography>{`${bind.spellName} ${bind.Target} ${bind.Mod} ${bind.Key}`}</Typography>
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
																invalidBinds.length;
																i++
															) {
																dontFilterBind =
																	dontFilterBind &&
																	!(
																		bind.SpellId ===
																			invalidBinds[
																				i
																			]
																				.SpellId &&
																		bind.Target ===
																			invalidBinds[
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
												setInvalidBinds([]);
												setEditingKey();
												setKeybinding({
													SpellId: null,
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
											SpellId: null,
											Target: null,
											Mod: null,
											Key: null,
										});
										setAllKeybinds(
											allKeybindings[keyBindingKey]
										);
										setInvalidBinds([]);
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
							invalidBinds={invalidBinds}
							setInvalidBinds={setInvalidBinds}
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
