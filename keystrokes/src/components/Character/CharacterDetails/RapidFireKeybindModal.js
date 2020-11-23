import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import styleGuide from '../../../stylesheets/style';

RapidFireKeybindModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};

function RapidFireKeybindModal({ isOpen, setIsOpen }) {
	const classes = styleGuide();

	return (
		<Modal
			open={isOpen}
			onClose={() => setIsOpen(false)}
			className={classes.modal}
		>
			<div className={classes.rapidFireModalBackground}>
				<React.Fragment>
					<Grid container justify="space-between">
						<Grid item>
							<Button
								color="secondary"
								variant="contained"
								onClick={() => {}}
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
								Continue
							</Button>
						</Grid>
					</Grid>
				</React.Fragment>
			</div>
		</Modal>
	);
}

export default RapidFireKeybindModal;
