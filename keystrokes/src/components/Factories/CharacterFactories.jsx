import { characterDetails } from '../../config/constants';

export function Character({ name, characterClass, race, spec }) {
	return {
		class: characterClass,
		race,
		selectedSpec: spec,
		name,
		specs: {
			...Array(characterDetails.class[characterClass].length).fill({
				keybindings: [],
			}),
		},
	};
}

export function Spec({ keybindings = [], selectedKeybindings = 0 }, key) {
	return {
		keybindings: [
			...keybindings,
			{
				[key]: KeyBindings(key),
			},
		],
		selectedKeybindings,
	};
}

export function KeyBindings(key, description = '') {
	const baseTalents = {
		normal: { 15: '', 25: '', 30: '', 35: '', 40: '', 45: '', 50: '' },
		pvp: { 0: '', 1: '', 2: '' },
	};
	return { key, description, talents: baseTalents, covenant: { none: [''] } };
}
