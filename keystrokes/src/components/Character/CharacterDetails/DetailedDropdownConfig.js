import React, { useState } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import {
	Grid,
	ClickAwayListener,
	Button,
	Checkbox,
	FormControlLabel,
} from '@material-ui/core';
import styleGuide from '../../../stylesheets/style';
import { targettingDetails, targetting } from '../../../config/constants';

DetailedDropdownConfig.propTypes = {
	targetType: PropTypes.string,
	targettingOptions: PropTypes.object,
	setTargettingOptions: PropTypes.func,
};
function DetailedDropdownConfig({
	targetType,
	targettingOptions,
	setTargettingOptions,
}) {
	const [isOpen, setIsOpen] = useState(false);
	const classes = styleGuide();

	function handleClickAway() {
		setIsOpen(false);
	}
	function handleClick() {
		setIsOpen(!isOpen);
	}

	function handleOptionChange(name, option) {
		const val = [name, option];
		update(targettingOptions, {
			[val]: { $set: !targettingOptions[val] },
		});
	}

	return (
		<ClickAwayListener onClickAway={handleClickAway}>
			<div style={{ position: 'relative' }}>
				<Button onClick={handleClick}>
					{targettingDetails[targetType].name}
				</Button>
				{isOpen ? (
					<div className={classes.detailedDropdownConfig}>
						{targetting[targetType].map(option => {
							return (
								<div key={option}>
									<FormControlLabel
										control={
											<Checkbox
												style={{
													padding: '0px',
													paddingLeft: '9px',
												}}
												checked={
													targettingOptions[
														[targetType, option]
													]
												}
												color="primary"
												onChange={() => {
													handleOptionChange(
														targetType,
														option
													);
												}}
												inputProps={{
													'aria-label':
														'primary checkbox',
												}}
											/>
										}
										label={option}
									/>
								</div>
							);
						})}
					</div>
				) : null}
			</div>
		</ClickAwayListener>
	);
}

export default DetailedDropdownConfig;
