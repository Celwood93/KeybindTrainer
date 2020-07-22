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
	ExpansionPanel,
	ExpansionPanelSummary,
	ExpansionPanelDetails,
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
	setCharacter: PropTypes.func,
	spec: PropTypes.number,
	allKeybindings: PropTypes.object,
	setAllKeybindings: PropTypes.func,
	keyBinding: PropTypes.number,
};
function KeybindEditor({
	character,
	setCharacter,
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
					setAllKeybindings({
						...allKeybindings,
						[key]: keybindingsWeGot,
					});
				}
				//Set something to say "character not found"
				setLoading(false);
			} catch (e) {
				console.log(`failed to collect keybindings for path ${path}`);
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

	function markAsConfigured() {
		setCharacter(
			update(character, {
				specs: {
					[character.selectedSpec]: { configured: { $set: true } },
				},
			})
		);
	}

	return (
		<React.Fragment>
			<ManualKeybindModal
				isOpen={manualModal}
				characterClass={character.class}
				markAsConfigured={markAsConfigured}
				characterSpec={spec}
				setIsOpen={setManualModal}
				setAllKeybindings={setAllKeybindings}
				allKeybindings={allKeybindings}
				keyBindingKey={characterKeybindings(
					character,
					spec,
					keyBinding
				)}
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
					<ExpansionPanel>
						<ExpansionPanelSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1a-content"
							id="panel1a-header"
						>
							<Typography variant="h5" align="left">
								Preview
							</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
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
						</ExpansionPanelDetails>
					</ExpansionPanel>
				</Grid>
			</Grid>
		</React.Fragment>
	);
}

export default KeybindEditor;
