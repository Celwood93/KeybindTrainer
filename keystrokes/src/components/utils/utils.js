export function getNextKey(keys) {
	return keys[Math.floor(Math.random() * keys.length)];
}

export const keyTransformationMapping = {
	backquote: '`',
	bracketleft: '{',
	bracketright: '}',
	comma: ',',
	quote: "'",
	period: '.',
	slash: '/',
	backslash: '\\',
	equal: '=',
	minus: '-',
	semicolon: ';',
};

export function verifyKey(key) {
	if (key in keyTransformationMapping) {
		return keyTransformationMapping[key];
	}
	return key;
}

export const invalidKeys = [
	'shiftleft',
	'shiftright',
	'altleft',
	'altright',
	'controlleft',
	'controlright',
	'delete',
	'backspace',
	'insert',
	'capslock',
	'escape',
	'enter',
];

export function validatePress(newKey) {
	return !invalidKeys.includes(newKey);
}

export function characterKeybindings(character, spec, keyBinding) {
	return Object.keys(character.specs[spec].keybindings[keyBinding])[0];
}
