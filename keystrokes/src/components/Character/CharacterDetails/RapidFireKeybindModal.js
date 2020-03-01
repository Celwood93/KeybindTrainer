import React, { useState } from 'react';
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
			<div className={classes.paper}>
				<Grid container justify="flex-end">
					<Grid item>Work in Progress</Grid>
					<Grid item style={{ paddingTop: '5rem' }}>
						<Button
							onClick={() => {
								setIsOpen(false);
							}}
							size="large"
						>
							Close
						</Button>
					</Grid>
				</Grid>
			</div>
		</Modal>
	);
}

export default RapidFireKeybindModal;
