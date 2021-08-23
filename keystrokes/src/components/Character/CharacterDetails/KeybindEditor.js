import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import {
	Grid,
	Button,
	Typography,
	Menu,
	MenuItem,
	CircularProgress,
	Accordion,
	AccordionSummary,
	AccordionDetails,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styleGuide from '../../../stylesheets/style';
import { ref } from '../../../config/constants';
import { AllSpellsContext } from '../../../contexts/AllSpellsContext';
import { characterKeybindings } from '../../utils/utils';
import ManualKeybindModal from './ManualKeybindModal';
import { characterDetails } from '../../../config/constants';
import KeybindTable from './KeybindTable';
import RapidFireKeybindModal from './RapidFireKeybindModal';

KeybindEditor.propTypes = {
	character: PropTypes.object,
	spec: PropTypes.number,
	allKeybindings: PropTypes.object,
	setAllKeybindings: PropTypes.func,
	keyBinding: PropTypes.number,
};
function KeybindEditor({
	character,
	spec,
	allKeybindings,
	setAllKeybindings,
	keyBinding,
}) {
	const classes = styleGuide();
	const allSpells = useContext(AllSpellsContext);
	const [editOptions, setEditOptions] = useState();
	const [formattedSpells, setFormattedSpells] = useState([]);
	const [classSpells, setClassSpells] = useState([]);
	const [rapidFireModal, setRapidFireModal] = useState(false);
	const [manualModal, setManualModal] = useState(false);
	const [loading, setLoading] = useState(true);
	const [loadingSpells, setLoadingSpells] = useState(true);

	useEffect(() => {
		async function getSpells() {
			try {
				const snapShot = await ref
					.child(`/Spells/${character.class}`)
					.once('value');
				if (snapShot.exists()) {
					setClassSpells(snapShot.val());
					setLoadingSpells(false);
				} else {
					console.log('snapshot did not exist for character spells');
				}
			} catch (e) {
				console.error(`failed to get spells for ${character.class}`);
			}
		}
		getSpells();
	}, [character.class]);

	useEffect(() => {
		async function collectKeybindings() {
			const path = `/Keybindings/${characterKeybindings(
				character,
				spec,
				keyBinding
			)}`;
			if (
				!Object.keys(allKeybindings).includes(
					characterKeybindings(character, spec, keyBinding)
				)
			) {
				try {
					const snapShot = await ref.child(path).once('value');
					const keybindingsWeGot = snapShot.exists()
						? snapShot.val()
						: [];
					const key = characterKeybindings(
						character,
						spec,
						keyBinding
					);
					const storage = window.localStorage.getItem('backup');
					if (storage) {
						const jsonStorage = JSON.parse(storage);
						jsonStorage.fromDB['keybindings'] = jsonStorage.fromDB
							.keybindings
							? update(jsonStorage.fromDB.keybindings, {
									[key]: { $set: keybindingsWeGot },
							  })
							: update(
									{},
									{
										[key]: { $set: keybindingsWeGot },
									}
							  );
						window.localStorage.setItem(
							'backup',
							JSON.stringify(jsonStorage)
						);
					}
					setAllKeybindings(
						update(allKeybindings, {
							[key]: { $set: keybindingsWeGot },
						})
					);
				} catch (e) {
					console.error(
						`failed to collect keybindings for path ${path}`,
						e
					);
				}
			}
			//Set something to say "character not found"
			setLoading(false);
		}
		collectKeybindings();
	}, [spec, keyBinding]);

	function updateSpellList() {
		const stringSpec = characterDetails.class[character.class][
			spec
		].toUpperCase();
		const normalTalents = Object.keys(
			character.specs[spec].keybindings[keyBinding][
				characterKeybindings(character, spec, keyBinding)
			].talents.normal
		).map(
			lvl =>
				character.specs[spec].keybindings[keyBinding][
					characterKeybindings(character, spec, keyBinding)
				].talents.normal[lvl]
		);
		const covChoice = Object.values(
			character.specs[spec].keybindings[keyBinding][
				characterKeybindings(character, spec, keyBinding)
			].covenant
		)[0];

		const pvpTalents =
			character.specs[spec].keybindings[keyBinding][
				characterKeybindings(character, spec, keyBinding)
			].talents.pvp;

		const talentSpells = normalTalents
			.filter(codeString => !!codeString)
			.map(code => allSpells[code]);
		const spellsAddedByOtherSpells = normalTalents
			.filter(codeString => !!codeString)
			.map(code => allSpells[code].enabledSpells || [])
			.flat()
			.map(code => allSpells[code])
			.filter(spellDetails => !spellDetails.isPassive);
		let replacedSpellIds = talentSpells
			.filter(spell => !!spell.idOfReplacedSpell)
			.map(val => val.idOfReplacedSpell)
			.flat();
		const covSpells = covChoice
			.filter(codeString => !!codeString) //useful for for default empty string
			.map(code => allSpells[code]);
		const spellsAddedByCovSpells = covChoice //might be not needed because we already have it included in the cov grouping
			.filter(codeString => !!codeString)
			.map(code => allSpells[code].enabledSpells || [])
			.flat()
			.map(code => allSpells[code])
			.filter(spellDetails => !spellDetails.isPassive);
		replacedSpellIds = replacedSpellIds.concat(
			covSpells
				.filter(spell => !!spell.idOfReplacedSpell)
				.map(val => val.idOfReplacedSpell)
				.flat()
		);
		const pvpTalentSpells = pvpTalents
			.filter(codeString => !!codeString)
			.map(code => allSpells[code]);
		const spellsAddedByOtherPvpTalentSpells = pvpTalents
			.filter(codeString => !!codeString)
			.map(code => allSpells[code].enabledSpells || [])
			.flat()
			.map(code => allSpells[code])
			.filter(spellDetails => !spellDetails.isPassive);
		replacedSpellIds = replacedSpellIds.concat(
			pvpTalentSpells
				.filter(spell => !!spell.idOfReplacedSpell)
				.map(val => val.idOfReplacedSpell)
				.flat()
		);
		const formattedSpellsList = classSpells
			.map(code => allSpells[code])
			.concat(talentSpells)
			.concat(covSpells)
			.concat(spellsAddedByCovSpells)
			.concat(pvpTalentSpells)
			.concat(spellsAddedByOtherPvpTalentSpells)
			.filter(spell => !spell.spec || spell.spec.includes(stringSpec))
			.concat(spellsAddedByOtherSpells)
			.filter(spellDetails => !spellDetails.isPassive)
			.filter(elem => !replacedSpellIds.includes(elem.spellId));

		return formattedSpellsList;
	}

	useEffect(() => {
		setFormattedSpells(updateSpellList());
	}, [classSpells, character, spec]);

	const handleClick = event => {
		setEditOptions(event.currentTarget);
	};

	const handleClose = () => {
		setEditOptions();
	};
	return (
		<React.Fragment>
			{!loadingSpells && (
				<React.Fragment>
					<ManualKeybindModal
						isOpen={manualModal}
						characterClass={character.class}
						characterSpec={spec}
						setIsOpen={setManualModal}
						setAllKeybindings={setAllKeybindings}
						allKeybindings={allKeybindings}
						keyBindingKey={characterKeybindings(
							character,
							spec,
							keyBinding
						)}
						formattedSpells={formattedSpells}
					/>
					<RapidFireKeybindModal
						isOpen={rapidFireModal}
						setIsOpen={setRapidFireModal}
						formattedSpells={formattedSpells}
						setAllKeybindings={setAllKeybindings}
						allKeybindings={allKeybindings}
						keyBindingKey={characterKeybindings(
							character,
							spec,
							keyBinding
						)}
					/>
				</React.Fragment>
			)}
			<Grid
				container
				direction="row"
				justify="space-between"
				alignItems="flex-end"
			>
				<Grid item>
					<Typography variant="h2">Keybindings</Typography>
				</Grid>
				<Grid item>
					<Button
						variant="contained"
						id="keybind-edit-button"
						aria-controls="simple-menu"
						aria-haspopup="true"
						color="primary"
						className={classes.bottomMarginNegTwo}
						onClick={handleClick}
					>
						Edit
					</Button>
					<Menu
						id="simple-menu"
						anchorEl={editOptions}
						keepMounted
						open={Boolean(editOptions)}
						onClose={handleClose}
					>
						<MenuItem
							onClick={() => {
								setManualModal(true);
								handleClose();
							}}
						>
							Manual
						</MenuItem>
						<MenuItem
							onClick={() => {
								setRapidFireModal(true);
								handleClose();
							}}
						>
							Rapid Fire
						</MenuItem>
					</Menu>
				</Grid>
			</Grid>
			<Grid container direction="row">
				<Grid item md={12}>
					<Accordion>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1a-content"
							id="panel1a-header-keybinds"
						>
							<Typography variant="h5" align="left">
								Preview
							</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Grid item md={12}>
								{!loading &&
								allKeybindings[
									characterKeybindings(
										character,
										spec,
										keyBinding
									)
								] ? (
									<KeybindTable
										allKeybinds={
											allKeybindings[
												characterKeybindings(
													character,
													spec,
													keyBinding
												)
											]
										}
									/>
								) : (
									<CircularProgress />
								)}
							</Grid>
						</AccordionDetails>
					</Accordion>
				</Grid>
			</Grid>
		</React.Fragment>
	);
}

export default KeybindEditor;
