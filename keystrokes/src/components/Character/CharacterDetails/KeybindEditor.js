import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
	Grid,
	Button,
	Typography,
	Paper,
	Menu,
	MenuItem,
	ExpansionPanel,
	ExpansionPanelSummary,
	ExpansionPanelDetails,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styleGuide from '../../../stylesheets/style';
import ManualKeybindModal from './ManualKeybindModal';
import RapidFireKeybindModal from './RapidFireKeybindModal';

function KeybindEditor({ character, setCharacter }) {
	const classes = styleGuide();
	const [editOptions, setEditOptions] = useState();
	const [rapidFireModal, setRapidFireModal] = useState(false);
	const [manualModal, setManualModal] = useState(true);

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
				setIsOpen={setManualModal}
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
							<Typography>Work In Progress</Typography>
						</ExpansionPanelDetails>
					</ExpansionPanel>
				</Grid>
			</Grid>
		</React.Fragment>
	);
}

export default KeybindEditor;
