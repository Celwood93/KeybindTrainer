import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core';
import { ref, characterDetails } from '../../../../../config/constants';
import { AllSpellsContext } from '../../../../../contexts/AllSpellsContext';
import NormalTalentRow from './NormalTalentRow';

NormalTalentCalculator.propTypes = {
	character: PropTypes.object,
	setCharacter: PropTypes.func,
	spec: PropTypes.number,
};
function NormalTalentCalculator({ character, setCharacter, spec }) {
	const [normalTalents, setNormalTalents] = useState();
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
		console.log('toolTip useEffect');
		const toolTips = document.querySelectorAll(
			`#panel1a-content > div > div > div > div > div > a`
		);
		toolTips.forEach(e => {
			function getRidOfIt() {
				const waterMark = document.querySelector('.wowhead-tooltip');
				if (
					waterMark &&
					waterMark.children &&
					waterMark.children.length === 3
				) {
					waterMark.children[2].parentNode.removeChild(
						waterMark.children[2]
					);
					e.removeEventListener('mousemove', getRidOfIt);
				}
				if (
					waterMark &&
					waterMark.children &&
					waterMark.children.length < 3
				) {
					e.removeEventListener('mousemove', getRidOfIt);
				}
			}
			if (e) {
				e.addEventListener('mousemove', getRidOfIt);
			}
		});
	});

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
				}
			} catch (e) {
				console.error(`failed to get talents for ${character.class}`);
			}
		}
		getNormalTalents();
	}, [spec]);
	return (
		<Grid container xs={8} style={{ width: '611px', height: '400px' }}>
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
								level={indexLevelRelation[index]}
								character={character}
								setCharacter={setCharacter}
								spellsInfo={spellsInfo}
							/>
						);
					})}
		</Grid>
	);
}

export default NormalTalentCalculator;
