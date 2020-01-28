import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs, AppBar } from '@material-ui/core';
import '../../stylesheets/character.css';
import styleGuide from '../../stylesheets/style';
import { TabPanel, a11yProps } from './TabPanels';
import { ref } from '../../config/constants';

function CharacterDetailPage(props) {
	const [spec, setSpec] = useState(0); //replace 0 with something from props.
	const [keyBinding, setKeybindings] = useState(0); //replace 0 with something related to spec

	const handleSpecChange = (event, newSpec) => {
		setSpec(newSpec);
	};
	const handleKeybindChange = (event, newKeybindings) => {
		setKeybindings(newKeybindings);
	};

	return (
		<div className={styleGuide.tabRoot}>
			<AppBar position="static" color="default">
				<Tabs
					value={spec}
					onChange={handleSpecChange}
					textColor="primary"
					variant="fullWidth"
					scrollButtons="auto"
					aria-label="scrollable auto tabs example"
				>
					{[0, 1].map(val => {
						const tabLabel = `Item ${val}`;
						return (
							<Tab
								label={tabLabel}
								key={val}
								{...a11yProps(val)}
							/>
						);
					})}
				</Tabs>
			</AppBar>
			<AppBar position="static">
				<Tabs
					value={keyBinding}
					onChange={handleKeybindChange}
					variant="scrollable"
					scrollButtons="auto"
					aria-label="nav tabs example"
				>
					{[0, 1, 2].map(val => {
						const tabLabel = `Keybinding ${val}`;
						return (
							<Tab
								label={tabLabel}
								key={val}
								{...a11yProps(val)}
							/>
						);
					})}
				</Tabs>
			</AppBar>
			{[0, 1, 2].map(val => {
				return (
					<TabPanel value={keyBinding} key={val} index={val}>
						keybinding {val}
					</TabPanel>
				);
			})}
		</div>
	);
}

export default CharacterDetailPage;
