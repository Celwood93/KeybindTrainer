import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
	ClickAwayListener,
	Button,
	Checkbox,
	FormControlLabel,
} from '@material-ui/core';
import styleGuide from '../../../stylesheets/style';
import { targetting } from '../../../config/constants';

//If i ever want to reduce rerenders here, i can make the elements (being the dropdown options)
//this dropdown handles stateful
//and make it so that if targettingOptions changes, we run a useeffect to see if any of
//our elements have changed, if they have we update our elements. Elements are like:

DetailedDropdownConfig.propTypes = {
	name: PropTypes.string,
	checkedKey: PropTypes.array,
	targetType: PropTypes.string,
	targettingOptions: PropTypes.object,
	handleChange: PropTypes.func,
	handleCheckboxClick: PropTypes.func,
	additionalDetails: PropTypes.element,
};
function DetailedDropdownConfig({
	name,
	checkedKey,
	targetType,
	targettingOptions,
	handleChange,
	handleCheckboxClick,
	additionalDetails = <React.Fragment></React.Fragment>,
}) {
	const [isOpen, setIsOpen] = useState(false);
	const classes = styleGuide();

	function handleClickAway() {
		setIsOpen(false);
	}
	function handleClick() {
		setIsOpen(!isOpen);
	}
	function isChecked() {
		return getCheckedListLength() > 0;
	}

	function setCheckboxStyle() {
		const listLength = getCheckedListLength();
		if (!listLength) {
			return 'red';
		}
		if (targetting[targetType].length === listLength) {
			return 'green';
		} else {
			return 'GoldenRod';
		}
	}

	function getCheckedListLength() {
		return targetting[targetType].filter(option => {
			return targettingOptions[[...checkedKey, option]];
		}).length;
	}

	return (
		<Fragment>
			{targettingOptions && (
				<span>
					<Checkbox
						style={{
							padding: '0px',
							paddingLeft: '9px',
							color: setCheckboxStyle(),
						}}
						checked={isChecked()}
						color="primary"
						onChange={() => {
							handleCheckboxClick(targetType);
						}}
						inputProps={{
							'aria-label': 'primary checkbox',
						}}
					/>
					{additionalDetails}
					<ClickAwayListener onClickAway={handleClickAway}>
						<span style={{ position: 'relative' }}>
							<Button onClick={handleClick}>{name}</Button>
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
																paddingLeft:
																	'9px',
															}}
															checked={
																targettingOptions[
																	[
																		...checkedKey,
																		option,
																	]
																]
															}
															color="primary"
															onChange={() => {
																handleChange(
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
						</span>
					</ClickAwayListener>
				</span>
			)}
		</Fragment>
	);
}

export default DetailedDropdownConfig;
