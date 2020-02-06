import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import styleGuide from '../../../stylesheets/style';

//this whole thing could probably be moved into its own file
TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};
export function TabPanel(props) {
	const { children, value, index, ...other } = props;
	const classes = styleGuide();
	return (
		<Grid
			container
			component="div"
			role="tabpanel"
			hidden={value !== index}
			id={`scrollable-auto-tabpanel-${index}`}
			aria-labelledby={`scrollable-auto-tab-${index}`}
			className={classes.tabPageContainer}
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
