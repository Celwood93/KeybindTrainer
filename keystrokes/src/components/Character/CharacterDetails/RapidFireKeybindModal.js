import React, { useState, useEffect } from 'react';
import { Modal } from '@material-ui/core';
import { removeWaterMark } from '../../utils/toolTipHooks';
import PropTypes from 'prop-types';
import styleGuide from '../../../stylesheets/style';
import RapidFireModalConfiguration from './RapidFireModalConfiguration';
import RapidFireModalAction from './RapidFireModalAction';

RapidFireKeybindModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
	formattedSpells: PropTypes.array.isRequired,
	setAllKeybindings: PropTypes.func.isRequired,
	allKeybindings: PropTypes.object.isRequired,
	keyBindingKey: PropTypes.string.isRequired,
};
function RapidFireKeybindModal({
	isOpen,
	setIsOpen,
	setAllKeybindings,
	allKeybindings,
	keyBindingKey,
	formattedSpells,
}) {
	const classes = styleGuide();
	const [spellTargetOpts, setSpellTargetOpts] = useState();
	const [lifecycleStep, setLifecycleStep] = useState(1); //steps of the app, 1 is configuration, 2 is game, 3 is writing to db?
	removeWaterMark('#rapid-fire-modal a');

	function closeInConf() {
		setIsOpen(false);
	}
	function closeInAction() {
		setIsOpen(false);
		setLifecycleStep(1);
	}
	function finishConf() {
		setLifecycleStep(2);
	}

	return (
		<Modal
			open={isOpen}
			onClose={() => {}}
			className={classes.modal}
			keepMounted={true}
			id={'rapid-fire-modal-body'}
		>
			<div
				id="rapid-fire-modal"
				className={classes.rapidFireModalBackground}
			>
				<div
					style={{
						display: lifecycleStep === 1 ? '' : 'none',
						height: '100%',
						width: '100%',
					}}
				>
					<RapidFireModalConfiguration
						formattedSpells={formattedSpells}
						spellTargetOpts={spellTargetOpts}
						setSpellTargetOpts={setSpellTargetOpts}
						closeInConf={closeInConf}
						finishConf={finishConf}
					/>
				</div>
				{lifecycleStep === 2 && (
					<RapidFireModalAction
						formattedSpells={formattedSpells}
						spellTargetOpts={spellTargetOpts}
						setSpellTargetOpts={setSpellTargetOpts}
						closeInAction={closeInAction}
						setAllKeybindings={setAllKeybindings}
						allKeybindings={allKeybindings}
						keyBindingKey={keyBindingKey}
					/>
				)}
			</div>
		</Modal>
	);
}

export default RapidFireKeybindModal;
