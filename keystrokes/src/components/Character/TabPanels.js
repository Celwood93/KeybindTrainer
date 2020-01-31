import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Box, Grid } from '@material-ui/core';
import '../../stylesheets/character.css';

//this whole thing could probably be moved into its own file
TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};
export function TabPanel(props) {
	const { children, value, index, ...other } = props;
	console.log(children, value, index);
	return (
		<Grid
			container
			component="div"
			role="tabpanel"
			hidden={value !== index}
			id={`scrollable-auto-tabpanel-${index}`}
			aria-labelledby={`scrollable-auto-tab-${index}`}
			{...other}
		>
			{value === index && children}
		</Grid>
	);
}

export function a11yProps(index) {
	return {
		id: `scrollable-auto-tab-${index}`,
		'aria-controls': `scrollable-auto-tabpanel-${index}`,
	};
}
