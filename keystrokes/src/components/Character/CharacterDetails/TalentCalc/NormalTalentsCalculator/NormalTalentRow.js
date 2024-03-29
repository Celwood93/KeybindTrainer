import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import update from 'immutability-helper';
import { AllSpellsContext } from '../../../../../contexts/AllSpellsContext';
import { characterKeybindings } from '../../../../utils/utils';
import NormalTalentBox from './NormalTalentBox';
import ButtonTalCovFrame from '../ButtonTalCovFrame';

NormalTalentRow.propTypes = {
	character: PropTypes.object,
	setCharacter: PropTypes.func,
	level: PropTypes.number,
	spellsInfo: PropTypes.array,
	spec: PropTypes.number,
	keyBinding: PropTypes.number,
	allKeybindings: PropTypes.object,
	setAllKeybindings: PropTypes.func,
};
function NormalTalentRow({
	character,
	setCharacter,
	level,
	spellsInfo,
	spec,
	keyBinding,
	allKeybindings,
	setAllKeybindings,
}) {
	const [selectedTalent, setSelectedTalent] = useState(getSelectedTalent());
	const allSpells = useContext(AllSpellsContext);
	//Maybe move this logic to Talent Calculator so it can be used accross all 3 custom spells (talents,pvp,covs)
	useEffect(() => {
		const currentTalentId = getSelectedTalent();
		if (selectedTalent !== currentTalentId) {
			const keyBindingKey = characterKeybindings(
				character,
				spec,
				keyBinding
			);
			const talentsSameRow = spellsInfo
				.filter(spell => spell.spellId !== selectedTalent)
				.map(spell => spell.spellId);

			const spellsPreviouslyAdded =
				(currentTalentId && allSpells[currentTalentId].enabledSpells) ||
				[];
			//this is for things like when u keybind an affinity spell, switch affinities, then come back to the affinity spells affinity.
			const spellsBeingReadded =
				(selectedTalent && allSpells[selectedTalent].enabledSpells) ||
				[];

			const spellsPreviouslyDisabled =
				(currentTalentId &&
					allSpells[currentTalentId].idOfReplacedSpell) ||
				[];
			const spellsBeingDisabled =
				(selectedTalent &&
					allSpells[selectedTalent].idOfReplacedSpell &&
					allSpells[selectedTalent].idOfReplacedSpell) ||
				[];

			let keybindingChanges = { ...allKeybindings };
			const runs = allKeybindings[keyBindingKey].map((keybind, index) => {
				if (
					talentsSameRow.includes(keybind.spellId) ||
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
					spellsPreviouslyDisabled.includes(keybind.spellId) ||
					spellsBeingReadded.includes(keybind.spellId) ||
					(selectedTalent === keybind.spellId && keybind.disabled)
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
			});

			Promise.all(runs).then(_ => {
				setAllKeybindings(keybindingChanges);
			});

			setCharacter(
				update(character, {
					specs: {
						[spec]: {
							keybindings: {
								[keyBinding]: {
									[keyBindingKey]: {
										talents: {
											normal: {
												[level]: {
													$set: selectedTalent,
												},
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
	}, [selectedTalent]);

	useEffect(() => {
		setSelectedTalent(getSelectedTalent());
	}, [spec, keyBinding]);

	function getSelectedTalent() {
		let talentId =
			character.specs[spec].keybindings[keyBinding][
				characterKeybindings(character, spec, keyBinding)
			].talents.normal[level];
		return talentId ? talentId : '';
	}

	return (
		<Grid item md={12}>
			<Grid
				container
				justify="center"
				direction="row"
				spacing={1}
				style={{ maxHeight: '45px' }}
			>
				{spellsInfo
					.filter(spell => spell.spellId)
					.map(spellInfo => {
						return (
							<Grid
								key={spellInfo.spellId}
								item
								md={4}
								style={{ maxHeight: '45px' }}
							>
								<ButtonTalCovFrame
									spellInfo={spellInfo}
									selectedOption={selectedTalent}
									setSelectedOption={setSelectedTalent}
									children={
										<NormalTalentBox
											spellInfo={spellInfo}
											selectedTalent={selectedTalent}
										/>
									}
								/>
							</Grid>
						);
					})}
			</Grid>
		</Grid>
	);
}

export default NormalTalentRow;
