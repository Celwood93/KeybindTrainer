import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Grid, CircularProgress, Typography } from '@material-ui/core';
import update from 'immutability-helper';
import { ref, characterDetails } from '../../../../../config/constants';
import { AllSpellsContext } from '../../../../../contexts/AllSpellsContext';
import { removeWaterMark } from '../../../../utils/toolTipHooks';
import ButtonTalCovFrame from '../ButtonTalCovFrame';
import CovenantBox from './CovenantBox';
import { characterKeybindings } from '../../../../utils/utils';

CovenantCalculator.propTypes = {
	character: PropTypes.object,
	setCharacter: PropTypes.func,
	spec: PropTypes.number,
	keyBinding: PropTypes.number,
	allKeybindings: PropTypes.object,
	setAllKeybindings: PropTypes.func,
};
function CovenantCalculator({
	character,
	setCharacter,
	spec,
	keyBinding,
	allKeybindings,
	setAllKeybindings,
}) {
	const [covenants, setCovenants] = useState();
	const [selectedCov, setSelectedCov] = useState(
		Object.keys(
			character.specs[spec].keybindings[keyBinding][
				characterKeybindings(character, spec, keyBinding)
			].covenant
		)
			? Object.keys(
					character.specs[spec].keybindings[keyBinding][
						characterKeybindings(character, spec, keyBinding)
					].covenant
			  )[0]
			: ''
	);
	const [loading, setLoading] = useState(true);
	const allSpells = useContext(AllSpellsContext);
	removeWaterMark(`#panel1a-content a`);
	//The covenant will be read here as just "venthyr" or whichever, but we save it into character as venthyr: [...ids] so that we can more easily access the spells.

	useEffect(() => {
		const currentTalentObject = Object.keys(
			character.specs[spec].keybindings[keyBinding][
				characterKeybindings(character, spec, keyBinding)
			].covenant
		)[0];
		if (
			currentTalentObject &&
			selectedCov &&
			covenants &&
			selectedCov !== currentTalentObject
		) {
			const keyBindingKey = characterKeybindings(
				character,
				spec,
				keyBinding
			);
			const otherCovenants = Object.keys(covenants)
				.filter(e => e !== selectedCov)
				.map(e => covenants[e])
				.flat();

			const spellsPreviouslyAdded =
				(currentTalentObject &&
					currentTalentObject !== 'none' &&
					covenants[currentTalentObject] &&
					covenants[currentTalentObject]
						.filter(
							code =>
								!!(
									allSpells[code] &&
									allSpells[code].enabledSpells
								)
						)
						.map(code => allSpells[code].enabledSpells)
						.flat()) ||
				[];
			//this is for things like when u keybind an affinity spell, switch affinities, then come back to the affinity spells affinity.
			const spellsBeingReadded =
				(selectedCov &&
					covenants[selectedCov] &&
					covenants[selectedCov]
						.filter(
							code =>
								!!(
									allSpells[code] &&
									allSpells[code].enabledSpells
								)
						)
						.map(code => allSpells[code].enabledSpells)
						.flat()) ||
				[];

			const spellsPreviouslyDisabled =
				(currentTalentObject &&
					currentTalentObject !== 'none' &&
					covenants[currentTalentObject] &&
					covenants[currentTalentObject]
						.filter(
							code =>
								!!(
									allSpells[code] &&
									allSpells[code].idOfReplacedSpell
								)
						)
						.map(code => allSpells[code].idOfReplacedSpell)
						.flat()) ||
				[];
			const spellsBeingDisabled =
				(selectedCov &&
					covenants[selectedCov] &&
					covenants[selectedCov]
						.filter(
							code =>
								!!(
									allSpells[code] &&
									allSpells[code].idOfReplacedSpell
								)
						)
						.map(code => allSpells[code].idOfReplacedSpell)
						.flat()) ||
				[];

			let keybindingChanges = { ...allKeybindings };
			const runs = allKeybindings[keyBindingKey].map((keybind, index) => {
				if (
					otherCovenants.includes(keybind.spellId) ||
					spellsPreviouslyAdded.includes(keybind.spellId)
				) {
					keybindingChanges = update(keybindingChanges, {
						[keyBindingKey]: {
							[index]: {
								$merge: { disabled: true },
							},
						},
					});
				}
				if (spellsPreviouslyDisabled.includes(keybind.spellId)) {
					keybindingChanges = update(keybindingChanges, {
						[keyBindingKey]: {
							[index]: {
								$unset: ['disabled'],
							},
						},
					});
				}
				if (spellsBeingReadded.includes(keybind.spellId)) {
					keybindingChanges = update(keybindingChanges, {
						[keyBindingKey]: {
							[index]: {
								$unset: ['disabled'],
							},
						},
					});
				}

				if (
					covenants[selectedCov] &&
					covenants[selectedCov].includes(keybind.spellId) &&
					keybind.disabled
				) {
					keybindingChanges = update(keybindingChanges, {
						[keyBindingKey]: {
							[index]: {
								$unset: ['disabled'],
							},
						},
					});
				}
				if (spellsBeingDisabled.includes(keybind.spellId)) {
					keybindingChanges = update(keybindingChanges, {
						[keyBindingKey]: {
							[index]: {
								$merge: { disabled: true },
							},
						},
					});
				}
				return true;
			});

			Promise.all(runs).then(e => {
				setAllKeybindings(keybindingChanges);
			});
			const covSetter =
				selectedCov !== 'none'
					? { [selectedCov]: covenants[selectedCov] }
					: { none: [''] };
			setCharacter(
				update(character, {
					specs: {
						[spec]: {
							keybindings: {
								[keyBinding]: {
									[keyBindingKey]: {
										covenant: {
											$set: covSetter,
										},
									},
								},
							},
						},
					},
				})
			);
		}
	}, [selectedCov]);

	useEffect(() => {
		setSelectedCov(
			Object.keys(
				character.specs[spec].keybindings[keyBinding][
					characterKeybindings(character, spec, keyBinding)
				].covenant
			)
				? Object.keys(
						character.specs[spec].keybindings[keyBinding][
							characterKeybindings(character, spec, keyBinding)
						].covenant
				  )[0]
				: ''
		);
	}, [keyBinding, spec]);

	useEffect(() => {
		async function getCovenants() {
			try {
				const snapShot = await ref
					.child(`/Covenants/${character.class}`)
					.once('value');
				if (snapShot.exists()) {
					setCovenants(snapShot.val());
					setLoading(false);
				}
			} catch (e) {
				console.error(`failed to get talents for ${character.class}`);
			}
		}
		getCovenants();
	}, []);

	return loading ? (
		<CircularProgress />
	) : (
		<React.Fragment>
			<Typography align="left" variant="h4">
				Covenants
			</Typography>
			<Grid
				container
				justify="center"
				direction="row"
				spacing={1}
				style={{ width: '850px', height: '60px' }}
			>
				{covenants &&
					Object.keys(covenants).length > 0 &&
					Object.keys(covenants).map((covName, index) => {
						const covDetails = {
							spellsDetails: Object.keys(covenants[covName]).map(
								e => {
									return {
										spellDetail:
											allSpells[covenants[covName][e]],
									};
								}
							),
							spellId: covName,
						};
						return (
							<Grid
								key={covName}
								item
								md={3}
								style={{ maxHeight: '45px' }}
							>
								<ButtonTalCovFrame
									key={index}
									selectedOption={selectedCov}
									setSelectedOption={setter => {
										!!setter
											? setSelectedCov(setter)
											: setSelectedCov('none');
									}}
									spellInfo={covDetails}
									children={
										<CovenantBox
											selectedCov={selectedCov}
											spellsInfo={covDetails}
										/>
									}
								/>
							</Grid>
						);
					})}
			</Grid>
		</React.Fragment>
	);
}

export default CovenantCalculator;
