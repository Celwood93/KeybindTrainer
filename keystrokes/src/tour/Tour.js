import React, { useEffect, useState } from 'react';
import JoyRide, { ACTIONS, EVENTS, STATUS } from 'react-joyride';

function Tour() {
	const [stepList, setStepList] = useState([
		{
			content: (
				<div>
					You can interact with your own components through the
					spotlight.
					<br />
					Click the menu above!
				</div>
			),
			disableBeacon: true,
			disableOverlayClose: true,
			hideCloseButton: true,
			hideFooter: true,
			placement: 'bottom',
			spotlightClicks: true,
			styles: {
				options: {
					zIndex: 10000,
				},
			},
			target: '#root > div > div > div > nav > div > a:nth-child(2) > li',
			title: 'Menu',
		},
		{
			target:
				'#root > div > div > div > div > ul > div.makeStyles-newCharacterListItem-25 > div > div > p',
			content: 'now click this button',
		},
	]);
	const [run, setRun] = useState(true);
	const [stepIndexval, setStepIndex] = useState(0);

	function timeout(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	function handleJoyrideChanges(data) {
		const { action, index, status, type } = data;

		if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
			const stepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
			if (index === 0) {
				setTimeout(() => {
					if (window.location.pathname.includes('CharacterList')) {
						isAtPage = false;
						setRun(true);
					}
				}, 400);
			} else {
				setStepIndex(stepIndex);
			}
		} else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
			setRun(false);
		}

		console.groupCollapsed(
			type === EVENTS.TOUR_STATUS ? `${type}:${status}` : type
		);
		console.log(data);
		console.groupEnd();
	}
	return (
		<JoyRide
			steps={stepList}
			continuous={true}
			run={run}
			stepIndex={stepIndexval}
			steps={stepList}
			callback={handleJoyrideChanges}
		/>
	);
}

export default Tour;
