import { useEffect } from 'react';

export const enableToolTips = () => {
	useEffect(() => {
		const script = document.createElement('script');

		script.src = 'https://wow.zamimg.com/widgets/power.js';
		script.async = true;

		document.body.appendChild(script);

		return () => {
			document.body.removeChild(script);
		};
	}, []);
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
	if (!dep) {
		useEffect(useEffectFunction);
	} else {
		useEffect(useEffectFunction, dep);
	}
};
