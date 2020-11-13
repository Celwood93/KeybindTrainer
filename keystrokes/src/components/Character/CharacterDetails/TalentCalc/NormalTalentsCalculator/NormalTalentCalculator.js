import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Grid, CircularProgress } from '@material-ui/core';
import { ref, characterDetails } from '../../../../../config/constants';
import { AllSpellsContext } from '../../../../../contexts/AllSpellsContext';
import NormalTalentRow from './NormalTalentRow';

NormalTalentCalculator.propTypes = {
	character: PropTypes.object,
	setCharacter: PropTypes.func,
	spec: PropTypes.number,
	keyBinding: PropTypes.number,
	allKeybindings: PropTypes.object,
	setAllKeybindings: PropTypes.func,
};
function NormalTalentCalculator({
	character,
	setCharacter,
	spec,
	keyBinding,
	allKeybindings,
	setAllKeybindings,
}) {
	const [normalTalents, setNormalTalents] = useState();
	const [loading, setLoading] = useState(true);
	const allSpells = useContext(AllSpellsContext);
	const indexLevelRelation = {
		0: 15,
		1: 25,
		2: 30,
		3: 35,
		4: 40,
		5: 45,
		6: 50,
	};

	useEffect(() => {
		async function getNormalTalents() {
			try {
				const snapShot = await ref
					.child(
						`/Talents/${character.class}/${
							characterDetails.class[character.class][spec]
						}/Normal`
					)
					.once('value');
				if (snapShot.exists()) {
					setNormalTalents(snapShot.val());
					setLoading(false);
				}
			} catch (e) {
				console.error(`failed to get talents for ${character.class}`);
			}
		}
		getNormalTalents();
	}, [spec]);

	return loading ? (
		<CircularProgress />
	) : (
		<Grid container style={{ width: '611px', height: '400px' }}>
			{normalTalents &&
				normalTalents.length > 0 &&
				normalTalents
					.reduce(
						(storage, talentId) => {
							const rowColData =
								allSpells[talentId] &&
								allSpells[talentId].talentCalcLoc.filter(
									e =>
										e.spec ===
										characterDetails.class[character.class][
											spec
										]
								);
							if (rowColData && rowColData[0]) {
								storage[rowColData[0].row * 1][
									rowColData[0].col * 1
								] = allSpells[talentId];
							}
							return storage;
						},
						[
							[{}, {}, {}],
							[{}, {}, {}],
							[{}, {}, {}],
							[{}, {}, {}],
							[{}, {}, {}],
							[{}, {}, {}],
							[{}, {}, {}],
						]
					)
					.map((spellsInfo, index) => {
						return (
							<NormalTalentRow
								key={index}
								spec={spec}
								keyBinding={keyBinding}
								level={indexLevelRelation[index]}
								character={character}
								setCharacter={setCharacter}
								spellsInfo={spellsInfo}
								allKeybindings={allKeybindings}
								setAllKeybindings={setAllKeybindings}
							/>
						);
					})}
		</Grid>
	);
}

export default NormalTalentCalculator;
