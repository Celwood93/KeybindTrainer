import firebase from 'firebase';

const config = {
	apiKey: 'AIzaSyDIKqaQX9sWRkCY2WIvIDrVGEzYWtPeLEQ',
	databaseURL: 'https://keystrokes-eb786.firebaseio.com',
	authDomain: 'keystrokes-eb786.firebaseapp.com',
	projectId: 'keystrokes-eb786',
};

if (window.location.hostname === 'localhost') {
	config.databaseURL = 'http://localhost:9000?ns=keystrokes-eb786';
}
firebase.initializeApp(config);

export const targetting = {
	ONE_ENEMY: ['Target', 'Focus', 'Arena1', 'Arena2', 'Arena3'],
	MANY_ENEMY: ['Target', 'Focus', 'Arena1', 'Arena2', 'Arena3'],
	ONE_FRIENDLY: ['Self', 'Target', 'Focus', 'Party1', 'Party2', 'Party3'],
	MANY_FRIENDLY: ['Self', 'Target', 'Focus', 'Party1', 'Party2', 'Party3'],
	ONE_ANY: [
		'Self',
		'Target',
		'Focus',
		'Party1',
		'Party2',
		'Party3',
		'Arena1',
		'Arena2',
		'Arena3',
	],
	SELF: ['Self'],
};

export const mods = ['None', 'Shift', 'Ctrl', 'Alt'];

export const characterDetails = {
	race: [
		'',
		'Night Elf',
		'Human',
		'Worgen',
		'Toren',
		'Blood Elf',
		'Orc',
		'Troll',
		'Undead',
		'Dwarf',
		'Gnome',
		'Goblin',
	],
	class: {
		'': [],
		Shaman: ['RESTORATION', 'ELEMENTAL', 'ENHANCEMENT'],
		Monk: ['MISTWEAVER', 'BREWMASTER', 'WINDWALKER'],
		Druid: ['FERAL', 'RESTORATION', 'GUARDIAN', 'BALANCE'],
		Paladin: ['PROTECTION', 'HOLY', 'RETRIBUTION'],
		Priest: ['DISCIPLINE', 'SHADOW', 'HOLY'],
		Mage: ['FIRE', 'FROST', 'ARCANE'],
		Warrior: ['ARMS', 'FURY', 'PROTECTION'],
		'Death Knight': ['BLOOD', 'UNHOLY', 'FROST'],
		'Demon Hunter': ['HAVOC', 'VENGEANCE'],
	},
};

export const ref = firebase.database().ref();
export const auth = firebase.auth();
export const googleProvider = firebase.auth.GoogleAuthProvider.PROVIDER_ID;
export const emailProvider = firebase.auth.EmailAuthProvider.PROVIDER_ID;
