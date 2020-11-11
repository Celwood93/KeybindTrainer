import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
	Grid,
	Button,
	Typography,
	Paper,
	ExpansionPanel,
	ExpansionPanelSummary,
	ExpansionPanelDetails,
} from '@material-ui/core';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ReactHtmlParser from 'react-html-parser';
import update from 'immutability-helper';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styleGuide from '../../../stylesheets/style';
import { TabPanel } from '../helpers/TabPanels';
import { characterKeybindings } from '../../utils/utils';
import KeybindEditor from './KeybindEditor';
import TalentCalculator from './TalentCalc/TalentCalculator';

CharacterKeybindDisplay.propTypes = {
	index: PropTypes.number,
	character: PropTypes.object,
	setCharacter: PropTypes.func,
	spec: PropTypes.number,
	keyBinding: PropTypes.number,
	allKeybindings: PropTypes.object,
	setAllKeybindings: PropTypes.func,
};
function CharacterKeybindDisplay({
	keyBinding,
	spec,
	index,
	character,
	setCharacter,
	allKeybindings,
	setAllKeybindings,
}) {
	const classes = styleGuide();
	const [descriptionToggle, setDescriptionToggle] = useState(false);
	const [descriptionText, setDescriptionText] = useState(
		character.specs[spec].keybindings[keyBinding][
			characterKeybindings(character, spec, keyBinding)
		].description || ''
	);

	useEffect(() => {
		setDescriptionToggle(false);
	}, [spec, keyBinding]);

	function toggleDescription(saving) {
		if (saving) {
			const characterKey = characterKeybindings(
				character,
				spec,
				keyBinding
			);
			const updatedCharacter = update(character, {
				specs: {
					[spec]: {
						keybindings: {
							[keyBinding]: {
								[characterKey]: {
									$merge: {
										description: descriptionText,
									},
								},
							},
						},
					},
				},
			});
			setCharacter(updatedCharacter);
		} else {
			setDescriptionText(
				character.specs[spec].keybindings[keyBinding][
					characterKeybindings(character, spec, keyBinding)
				].description || ''
			);
		}
		setDescriptionToggle(!descriptionToggle);
	}

	return (
		<TabPanel value={keyBinding} index={index}>
			<Grid container spacing={1}>
				<Grid
					container
					direction="row"
					justify="space-between"
					alignItems="flex-end"
				>
					<Grid item>
						<Typography variant="h2">Description</Typography>
					</Grid>
					<Grid item>
						{!descriptionToggle ? (
							<Button
								variant="contained"
								color="primary"
								id="description-edit-button"
								className={classes.bottomMarginNegTwo}
								onClick={() => toggleDescription(false)}
							>
								Edit
							</Button>
						) : (
							<div>
								<Button
									variant="contained"
									id="description-cancel-button"
									color="secondary"
									className={classes.bottomMarginNegTwo}
									onClick={() => toggleDescription(false)}
								>
									Cancel
								</Button>
								<Button
									variant="contained"
									color="primary"
									id="description-save-button"
									className={classes.bottomMarginNegTwo}
									onClick={() => toggleDescription(true)}
								>
									Apply
								</Button>
							</div>
						)}
					</Grid>
				</Grid>
				<Grid container direction="row">
					<Grid item md={12}>
						{!descriptionToggle ? (
							<Paper
								elevation={3}
								className={classes.paddingTwoRem}
							>
								<Typography
									align="left"
									component="span"
									id="description-text"
								>
									{ReactHtmlParser(
										character.specs[spec].keybindings[
											keyBinding
										][
											characterKeybindings(
												character,
												spec,
												keyBinding
											)
										].description
									)}
								</Typography>
							</Paper>
						) : (
							<Paper
								elevation={3}
								className={classes.paddingTwoRem}
							>
								<ReactQuill
									value={descriptionText}
									style={{ fontSize: '1rem' }}
									id="description-edit-area"
									theme="snow"
									onChange={value =>
										setDescriptionText(value)
									}
									formats={[
										'bold',
										'italic',
										'underline',
										'list',
										'bullet',
									]}
									modules={{
										toolbar: [
											['bold', 'italic', 'underline'],
											[
												{ list: 'ordered' },
												{ list: 'bullet' },
											],
										],
									}}
								/>
							</Paper>
						)}
					</Grid>
				</Grid>
				<br />
				<Grid
					container
					direction="row"
					justify="space-between"
					alignItems="flex-end"
				>
					<Grid item>
						<Typography variant="h2">Talents</Typography>
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
									Talent Calculator
								</Typography>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								<TalentCalculator
									character={character}
									setCharacter={setCharacter}
									spec={spec}
								/>
							</ExpansionPanelDetails>
						</ExpansionPanel>
					</Grid>
				</Grid>
				<br />
				<KeybindEditor
					character={character}
					spec={spec}
					keyBinding={keyBinding}
					allKeybindings={allKeybindings}
					setAllKeybindings={setAllKeybindings}
				/>
			</Grid>
		</TabPanel>
	);
}

export default CharacterKeybindDisplay;
