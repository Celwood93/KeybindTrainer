import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Grid, Typography } from '@material-ui/core';
import { targettingDetails, targetting } from '../../../config/constants';
import PropTypes from 'prop-types';
import styleGuide from '../../../stylesheets/style';
import DetailedDropdownConfig from './DetailedDropdownConfig';

RapidFireKeybindModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};

function RapidFireKeybindModal({ isOpen, setIsOpen }) {
	const classes = styleGuide();
	const [targettingOpts, setTargettingOpts] = useState(
		createTargetOptsBaseline()
	);

	function resetFilter() {
		console.log('here');
	}

	function createTargetOptsBaseline() {
		let targetOpts = {};
		Object.keys(targettingDetails).forEach(targetType =>
			targetting[targetType].forEach(targetSubType => {
				targetOpts[[targetType, targetSubType]] = true;
			})
		);
		return targetOpts;
	}

	return (
		<Modal open={isOpen} onClose={() => {}} className={classes.modal}>
			<div className={classes.rapidFireModalBackground}>
				<React.Fragment>
					<Grid container justify="space-between">
						<Grid item>
							<Button
								color="secondary"
								variant="contained"
								onClick={() => setIsOpen(false)}
								size="large"
							>
								Cancel
							</Button>
						</Grid>
						<Grid item>
							<Button
								color="primary"
								variant="contained"
								size="large"
								onClick={() => {}}
							>
								Start Rapid Fire
							</Button>
						</Grid>
					</Grid>
					<Grid
						direction="row"
						container
						justify="space-evenly"
						alignItems="center"
					>
						<React.Fragment></React.Fragment>
						<Typography variant="button">
							Preset Configurations
						</Typography>{' '}
						<Button
							variant="contained"
							size="small"
							onClick={resetFilter}
						>
							Reset Filter
						</Button>
						<React.Fragment></React.Fragment>
					</Grid>
					<Grid container direction="row">
						{Object.keys(targettingDetails).map(targetType => (
							<DetailedDropdownConfig
								key={targetType}
								targetType={targetType}
								targettingOptions={targettingOpts}
								setTargettingOpts={setTargettingOpts}
							/>
						))}
					</Grid>
				</React.Fragment>
			</div>
		</Modal>
	);
}

export default RapidFireKeybindModal;
