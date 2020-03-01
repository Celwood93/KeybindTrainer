import { characterDetails } from '../../config/constants';

export function Character({ name, characterClass, race, spec }) {
	return {
		class: characterClass,
		race,
		selectedSpec: spec,
		name,
		specs: {
			...Array(characterDetails.class[characterClass].length).fill({
				configured: false,
				keybindings: [],
			}),
		},
	};
}

export function Spec(
	{ configured, keybindings, selectedKeybindings = 0 },
	key
) {
	return {
		configured,
		keybindings: [
			...keybindings,
			{
				[key]: KeyBindings(key),
			},
		],
		selectedKeybindings,
	};
}

export function KeyBindings(key, description = '', talents) {
	const defaultTalents = { 1: 1, 2: 2, 3: 3 }; //placeholder for now
	return { key, description, talents: talents || defaultTalents };
}
