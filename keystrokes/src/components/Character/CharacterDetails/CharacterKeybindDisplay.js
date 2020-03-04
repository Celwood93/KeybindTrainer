import React, { useState } from 'react';
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
import KeybindEditor from './KeybindEditor';

CharacterKeybindDisplay.propTypes = {
	index: PropTypes.number,
	character: PropTypes.object,
	setCharacter: PropTypes.func,
	spec: PropTypes.number,
	keyBinding: PropTypes.number,
};
function CharacterKeybindDisplay({
	keyBinding,
	spec,
	index,
	character,
	setCharacter,
}) {
	const classes = styleGuide();
	const [descriptionToggle, setDescriptionToggle] = useState(false);
	const [descriptionText, setDescriptionText] = useState(
		character.specs[spec].keybindings[keyBinding][
			Object.keys(character.specs[spec].keybindings[keyBinding])[0]
		].description || ''
	);

	function toggleDescription(saving = false) {
		if (saving) {
			const updatedCharacter = update(character, {
				specs: {
					[spec]: {
						keybindings: {
							[keyBinding]: {
								[Object.keys(
									character.specs[spec].keybindings[
										keyBinding
									]
								)[0]]: {
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
								className={classes.bottomMarginNegTwo}
								onClick={toggleDescription}
							>
								Edit
							</Button>
						) : (
							<div>
								<Button
									variant="contained"
									color="secondary"
									className={classes.bottomMarginNegTwo}
									onClick={toggleDescription}
								>
									Cancel
								</Button>
								<Button
									variant="contained"
									color="primary"
									className={classes.bottomMarginNegTwo}
									onClick={() => toggleDescription(true)}
								>
									Save
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
								<Typography align="left" component="span">
									{ReactHtmlParser(
										character.specs[spec].keybindings[
											keyBinding
										][
											Object.keys(
												character.specs[spec]
													.keybindings[keyBinding]
											)[0]
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
					<Grid item>
						<Button
							variant="contained"
							color="primary"
							className={classes.bottomMarginNegTwo}
						>
							Edit
						</Button>
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
								<Typography>Work In Progress</Typography>
							</ExpansionPanelDetails>
						</ExpansionPanel>
					</Grid>
				</Grid>
				<br />
				<KeybindEditor
					character={character}
					spec={spec}
					setCharacter={setCharacter}
				/>
			</Grid>
		</TabPanel>
	);
}

export default CharacterKeybindDisplay;
