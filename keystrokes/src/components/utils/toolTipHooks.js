import { useEffect } from 'react';

export const enableToolTips = () => {
	if (process.env.REACT_APP_DISABLE_TOOLTIPS !== 'disabled') {
		useEffect(() => {
			const script = document.createElement('script');
			script.src = 'https://wow.zamimg.com/widgets/power.js';
			script.async = true;
			document.body.appendChild(script);
			return () => {
				document.body.removeChild(script);
			};
		}, []);
	}
};

export const removeWaterMark = (path, dep) => {
	const useEffectFunction = () => {
		console.log('toolTip useEffect', path);
		const toolTips = document.querySelectorAll(path);
		toolTips.forEach(e => {
			function getRidOfIt() {
				const waterMark = document.querySelector('.wowhead-tooltip');
				if (
					waterMark &&
					waterMark.children &&
					waterMark.children.length === 3
				) {
					waterMark.children[2].parentNode.removeChild(
						waterMark.children[2]
					);
					waterMark.children[0].parentNode.removeChild(
						waterMark.children[0]
					);
					e.removeEventListener('mousemove', getRidOfIt);
				}
				if (
					waterMark &&
					waterMark.children &&
					waterMark.children.length < 3
				) {
					e.removeEventListener('mousemove', getRidOfIt);
				}
			}
			if (e) {
				e.addEventListener('mousemove', getRidOfIt);
			}
		});
	};
	if (process.env.REACT_APP_DISABLE_TOOLTIPS !== 'disabled') {
		if (!dep) {
			useEffect(useEffectFunction);
		} else {
			useEffect(useEffectFunction, dep);
		}
	}
};

export const removeLingeringPopups = () => {
	const popup = Array.from(
		document.getElementsByClassName(
			'wowhead-tooltip wowhead-tooltip-width-restriction'
		)
	);
	if (popup.length > 0) {
		popup.forEach(e => {
			e.setAttribute('style', 'display: none');
		});
	}
};
