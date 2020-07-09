export function getNextKey(keys) {
	return keys[Math.floor(Math.random() * keys.length)];
}

export function verifyKey(key) {
	if (key.length > 2) {
		if (key === 'backquote') {
			return '`';
		} else if (key === 'bracketleft') {
			return '{';
		} else if (key === 'bracketright') {
			return '}';
		} else if (key === 'comma') {
			return ',';
		} else if (key === 'quote') {
			return "'";
		} else if (key === 'period') {
			return '.';
		} else if (key === 'slash') {
			return '/';
		} else if (key === 'backslash') {
			return '\\';
		} else if (key === 'equal') {
			return '=';
		} else if (key === 'minus') {
			return '-';
		} else if (key === 'semicolon') {
			return ';';
		}
	}
	return key;
}

export function validatePress(newKey) {
	return (
		newKey !== 'shiftleft' &&
		newKey !== 'shiftright' &&
		newKey !== 'altleft' &&
		newKey !== 'altright' &&
		newKey !== 'controlleft' &&
		newKey !== 'controlright' &&
		newKey !== 'delete' &&
		newKey !== 'backspace' &&
		newKey !== 'insert' &&
		newKey !== 'capslock' &&
		newKey !== 'escape' &&
		newKey !== 'enter'
	);
}

export function characterKeybindings(character, spec, keyBinding) {
	return Object.keys(character.specs[spec].keybindings[keyBinding])[0];
}
