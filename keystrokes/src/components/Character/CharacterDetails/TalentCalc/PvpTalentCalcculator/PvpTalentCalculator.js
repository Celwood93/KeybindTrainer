import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Grid, CircularProgress } from '@material-ui/core';
import { isEqual } from 'lodash';
import update from 'immutability-helper';
import { ref, characterDetails } from '../../../../../config/constants';
import { AllSpellsContext } from '../../../../../contexts/AllSpellsContext';
import PvpTalentSelector from './PvpTalentSelector';
import PvpTalentModal from './PvpTalentModal';
import { characterKeybindings } from '../../../../utils/utils';

PvpTalentCalculator.propTypes = {
	character: PropTypes.object,
	setCharacter: PropTypes.func,
	spec: PropTypes.number,
	keyBinding: PropTypes.number,
	allKeybindings: PropTypes.object,
	setAllKeybindings: PropTypes.func,
};
function PvpTalentCalculator({
	character,
	setCharacter,
	spec,
	keyBinding,
	allKeybindings,
	setAllKeybindings,
}) {
	const [pvpTalents, setPvpTalents] = useState();
	const [isOpenIndex, setIsOpenIndex] = useState(3);
	const [selectedPvpTalents, setSelectedPvpTalents] = useState(
		getSavedPvpTalents()
	);
	const [loading, setLoading] = useState(true);
	const allSpells = useContext(AllSpellsContext);

	useEffect(() => {
		async function getPvpTalents() {
			try {
				const snapShot = await ref
					.child(
						`/Talents/${character.class}/${
							characterDetails.class[character.class][spec]
						}/PvP`
					)
					.once('value');
				if (snapShot.exists()) {
					const pvpTalentArray = Object.values(snapShot.val());
					setPvpTalents(pvpTalentArray);
					setLoading(false);
				}
			} catch (e) {
				console.error(
					`failed to get pvp talents for ${character.class}`
				);
			}
		}
		getPvpTalents();
	}, [spec]);

	useEffect(() => {
		const currentPvpTalentIds = getSavedPvpTalents();
		if (!isEqual(selectedPvpTalents, currentPvpTalentIds)) {
			const keyBindingKey = characterKeybindings(
				character,
				spec,
				keyBinding
			);
			let changedIndex = 0;
			selectedPvpTalents.forEach((e, index) => {
				if (currentPvpTalentIds[index] !== e) {
					changedIndex = index;
				}
			});
			const isSpellAlreadyInList = currentPvpTalentIds.findIndex(
				code => code === selectedPvpTalents[changedIndex]
			);
			if (isSpellAlreadyInList === -1) {
				const pvpTalentReplaced = [currentPvpTalentIds[changedIndex]];

				const spellsPreviouslyAdded =
					(currentPvpTalentIds[changedIndex] &&
						allSpells[currentPvpTalentIds[changedIndex]]
							.enabledSpells) ||
					[];
				//this is for things like when u keybind an affinity spell, switch affinities, then come back to the affinity spells affinity.
				const spellsBeingReadded =
					(selectedPvpTalents[changedIndex] &&
						allSpells[selectedPvpTalents[changedIndex]]
							.enabledSpells) ||
					[];

				const spellsPreviouslyDisabled =
					(currentPvpTalentIds[changedIndex] &&
						allSpells[currentPvpTalentIds[changedIndex]]
							.idOfReplacedSpell) ||
					[];
				const spellsBeingDisabled =
					(selectedPvpTalents[changedIndex] &&
						allSpells[selectedPvpTalents[changedIndex]]
							.idOfReplacedSpell &&
						allSpells[selectedPvpTalents[changedIndex]]
							.idOfReplacedSpell) ||
					[];

				let keybindingChanges = { ...allKeybindings };
				const runs = allKeybindings[keyBindingKey].map(
					(keybind, index) => {
						if (
							pvpTalentReplaced.includes(keybind.spellId) ||
							spellsPreviouslyAdded.includes(keybind.spellId) ||
							spellsBeingDisabled.includes(keybind.spellId)
						) {
							keybindingChanges = update(keybindingChanges, {
								[keyBindingKey]: {
									[index]: {
										$merge: { disabled: true },
									},
								},
							});
						}
						if (
							spellsPreviouslyDisabled.includes(
								keybind.spellId
							) ||
							spellsBeingReadded.includes(keybind.spellId) ||
							(selectedPvpTalents[changedIndex] ===
								keybind.spellId &&
								keybind.disabled)
						) {
							keybindingChanges = update(keybindingChanges, {
								[keyBindingKey]: {
									[index]: {
										$unset: ['disabled'],
									},
								},
							});
						}
						return true;
					}
				);

				Promise.all(runs).then(_ => {
					setAllKeybindings(keybindingChanges);
				});
			} else {
				selectedPvpTalents[isSpellAlreadyInList] = '';
				setSelectedPvpTalents([...selectedPvpTalents]);
			}

			setCharacter(
				update(character, {
					specs: {
						[spec]: {
							keybindings: {
								[keyBinding]: {
									[keyBindingKey]: {
										talents: {
											pvp: {
												$set: selectedPvpTalents,
											},
										},
									},
								},
							},
						},
					},
				})
			);
		}
	}, [selectedPvpTalents]);

	useEffect(() => {
		setSelectedPvpTalents(getSavedPvpTalents());
	}, [spec, keyBinding]);

	function getSavedPvpTalents() {
		const charPvpTalents =
			character.specs[spec].keybindings[keyBinding][
				characterKeybindings(character, spec, keyBinding)
			].talents.pvp;
		return charPvpTalents ? charPvpTalents : ['', '', ''];
	}

	return loading ? (
		<CircularProgress />
	) : (
		<React.Fragment>
			<PvpTalentModal
				isOpenIndex={isOpenIndex}
				setIsOpenIndex={setIsOpenIndex}
				pvpTalents={pvpTalents}
				selectedPvpTalents={selectedPvpTalents}
				setSelectedPvpTalents={setSelectedPvpTalents}
			/>
			<Grid item md={2}>
				<Grid
					container
					justify="center"
					alignItems="center"
					direction="column"
					style={{ marginBottom: '10px', paddingLeft: '65px' }}
					spacing={3}
				>
					{selectedPvpTalents &&
						Object.keys(selectedPvpTalents).map(index => {
							return (
								<Grid
									key={index}
									item
									md={12}
									style={{ maxHeight: '100px' }}
								>
									<PvpTalentSelector
										selectedPvpTalents={selectedPvpTalents}
										setIsOpenIndex={setIsOpenIndex}
										index={index * 1}
									/>
								</Grid>
							);
						})}
				</Grid>
			</Grid>
		</React.Fragment>
	);
}

export default PvpTalentCalculator;
