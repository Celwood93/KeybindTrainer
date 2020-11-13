import React, { useState, useEffect } from 'react';
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
import { characterKeybindings } from '../../utils/utils';
import ManualKeybindModal from './ManualKeybindModal';
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
	const [editOptions, setEditOptions] = useState();
	const [rapidFireModal, setRapidFireModal] = useState(false);
	const [manualModal, setManualModal] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function collectKeybindings() {
			const path = `/Keybindings/${characterKeybindings(
				character,
				spec,
				keyBinding
			)}`;
			try {
				const snapShot = await ref.child(path).once('value');
				if (
					!Object.keys(allKeybindings).includes(
						characterKeybindings(character, spec, keyBinding)
					)
				) {
					const keybindingsWeGot = snapShot.exists()
						? snapShot.val()
						: [];
					const key = characterKeybindings(
						character,
						spec,
						keyBinding
					);
					setAllKeybindings(
						update(allKeybindings, {
							[key]: { $set: keybindingsWeGot },
						})
					);
				}
				//Set something to say "character not found"
				setLoading(false);
			} catch (e) {
				console.error(`failed to collect keybindings for path ${path}`);
			}
		}
		collectKeybindings();
	});

	const handleClick = event => {
		setEditOptions(event.currentTarget);
	};

	const handleClose = () => {
		setEditOptions();
	};
	return (
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
				normalTalents={Object.keys(
					character.specs[spec].keybindings[keyBinding][
						characterKeybindings(character, spec, keyBinding)
					].talents.normal
				).map(
					lvl =>
						character.specs[spec].keybindings[keyBinding][
							characterKeybindings(character, spec, keyBinding)
						].talents.normal[lvl]
				)}
				covChoice={
					Object.values(
						character.specs[spec].keybindings[keyBinding][
							characterKeybindings(character, spec, keyBinding)
						].covenant
					)[0]
				}
				pvpTalents={[]}
			/>
			<RapidFireKeybindModal
				isOpen={rapidFireModal}
				setIsOpen={setRapidFireModal}
			/>
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
