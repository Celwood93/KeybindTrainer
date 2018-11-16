import { pickRandomElement } from './utils/utils.js'

export function handleKeyPress(param, e) {
		console.log(this);
		console.log('event', e);
		if (!e.metaKey) {
			e.preventDefault();
		}
		const keyPressed = {
			key: e.code.toLowerCase().replace(/digit|key|left|right/i, ''),
			altKey: e.altKey,
			ctrlKey: e.ctrlKey,
			shiftKey: e.shiftKey,
		};
		if (
			keyPressed.key !== 'shift' &&
			keyPressed.key !== 'alt' &&
			keyPressed.key !== 'control'
		) {
			const expectedKey = this.state.keybindings[this.state.key];
			//there is an issue here if the key is not a letter or a number, such as ` or ,
			if (
				keyPressed.key === expectedKey.key &&
				((expectedKey.modifier === 'CONTROL' && keyPressed.ctrlKey) ||
					(expectedKey.modifier === 'SHIFT' && keyPressed.shiftKey) ||
					(expectedKey.modifier === 'ALT' && keyPressed.altKey) ||
					(expectedKey.modifier === 'NONE' &&
						!keyPressed.ctrlKey &&
						!keyPressed.altKey &&
						!keyPressed.shiftKey))
			) {
				pickRandomElement(this);
			}
		}
	};