export function getNextKey(givenThis) {
	return givenThis.state.keys[
		Math.floor(Math.random() * givenThis.state.keys.length)
	];
}
