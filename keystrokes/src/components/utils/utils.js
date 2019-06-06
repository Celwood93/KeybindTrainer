export function getNextKey(keys) {
	return keys[
		Math.floor(Math.random() * keys.length)
	];
}
