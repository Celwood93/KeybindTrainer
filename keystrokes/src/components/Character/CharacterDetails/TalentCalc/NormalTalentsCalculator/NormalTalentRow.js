import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import update from 'immutability-helper';
import { characterKeybindings } from '../../../../utils/utils';
import NormalTalentBox from './NormalTalentBox';

NormalTalentRow.propTypes = {
	character: PropTypes.object,
	setCharacter: PropTypes.func,
	level: PropTypes.number,
	spellsInfo: PropTypes.array,
	spec: PropTypes.number,
	keyBinding: PropTypes.number,
};
function NormalTalentRow({
	character,
	setCharacter,
	level,
	spellsInfo,
	spec,
	keyBinding,
}) {
	const [selectedTalent, setSelectedTalent] = useState(
		character.specs[spec].keybindings[keyBinding][
			characterKeybindings(character, spec, keyBinding)
		].talents.normal[level]
	);
	useEffect(() => {
		if (
			selectedTalent !==
			character.specs[spec].keybindings[keyBinding][
				characterKeybindings(character, spec, keyBinding)
			].talents.normal[level]
		) {
			const keyBindingKey = characterKeybindings(
				character,
				spec,
				keyBinding
			);
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
		setSelectedTalent(
			character.specs[spec].keybindings[keyBinding][
				characterKeybindings(character, spec, keyBinding)
			].talents.normal[level]
		);
	}, [spec, keyBinding]);

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
					.filter(e => e.spellId)
					.map(spellInfo => {
						return (
							<Grid
								key={spellInfo.spellId}
								item
								md={4}
								style={{ maxHeight: '45px' }}
							>
								<NormalTalentBox
									spellInfo={spellInfo}
									selectedTalent={selectedTalent}
									setSelectedTalent={setSelectedTalent}
								/>
							</Grid>
						);
					})}
			</Grid>
		</Grid>
	);
}

export default NormalTalentRow;
