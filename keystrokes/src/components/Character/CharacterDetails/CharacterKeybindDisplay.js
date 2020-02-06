import React from 'react';
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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styleGuide from '../../../stylesheets/style';
import { TabPanel } from '../helpers/TabPanels';

CharacterKeybindDisplay.propTypes = {
	val: PropTypes.string,
	index: PropTypes.number,
	keyBinding: PropTypes.obj,
};
function CharacterKeybindDisplay({ keyBinding, val, index }) {
	const classes = styleGuide();
	return (
		<TabPanel value={keyBinding} key={val} index={index}>
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
						<Paper elevation={3} className={classes.paddingTwoRem}>
							<Typography align="left" variant="body2">
								Hello there
							</Typography>
						</Paper>
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
			</Grid>
		</TabPanel>
	);
}

export default CharacterKeybindDisplay;
