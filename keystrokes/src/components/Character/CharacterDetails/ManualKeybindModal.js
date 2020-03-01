import React, { useState } from 'react';
import { Modal, Button, Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import styleGuide from '../../../stylesheets/style';

ManualKeybindModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};

function ManualKeybindModal({ isOpen, setIsOpen }) {
	const classes = styleGuide();

	return (
		<Modal open={isOpen} onClose={() => {}} className={classes.modal}>
			<div className={classes.manualModalBackground}>
				<Grid container justify="space-between">
					<Grid item>
						<Button
							color="secondary"
							variant="contained"
							onClick={() => {
								setIsOpen(false);
							}}
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
						>
							Finish
						</Button>
					</Grid>
				</Grid>
			</div>
		</Modal>
	);
}

export default ManualKeybindModal;
