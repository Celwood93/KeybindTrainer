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
	ONE_FRIENDLY: ['Self', 'Target', 'Focus', 'Party1', 'Party2'],
	MANY_FRIENDLY: ['Self', 'Target', 'Focus', 'Party1', 'Party2'],
	ONE_ANY: [
		'Self',
		'Target',
		'Focus',
		'Party1',
		'Party2',
		'Arena1',
		'Arena2',
		'Arena3',
	],
	SELF: ['Self'],
	PLACED: ['Cursor', 'Self'],
	FRIENDLY_NOT_SELF: ['Target', 'Focus', 'Party1', 'Party2'],
	ALL: [
		'Self',
		'Target',
		'Focus',
		'Party1',
		'Party2',
		'Arena1',
		'Arena2',
		'Arena3',
		'Cursor',
	],
};

export const targettingDetails = {
	ONE_ENEMY: {
		name: 'Enemy Target',
		tooltip: 'Spells that are only usable on one enemy target at a time.',
	},
	MANY_ENEMY: {
		name: 'Enemy Targets',
		tooltip: 'Spells that are usable on many enemies at once.',
	},
	ONE_FRIENDLY: {
		name: 'Ally Target',
		tooltip:
			'Spells that are only usable on one friendly target at a time.',
	},
	MANY_FRIENDLY: {
		name: 'Ally Targets',
		tooltip: 'Spells that are usable on many friendly targets at once.',
	},
	ONE_ANY: {
		name: 'Any Target',
		tooltip: 'Spells that are usable on a Ally or Enemy target.',
	},
	SELF: {
		name: 'Self',
		tooltip:
			'Spells that are only usable on yourself or a radius around yourself.',
	},
	PLACED: {
		name: 'Placed',
		tooltip: 'Spells that are triggered at your mouse cursor.',
	},
	FRIENDLY_NOT_SELF: {
		name: 'Assist Ally',
		tooltip: 'Spells that are usable on allies, but not yourself.',
	},
};

export const mods = ['None', 'Shift', 'Ctrl', 'Alt'];

export const characterDetails = {
	race: [
		'',
		'Night Elf',
		'Draenei',
		'Human',
		'Worgen',
		'Dwarf',
		'Gnome',
		'Tauren',
		'Blood Elf',
		'Orc',
		'Troll',
		'Undead',
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
		Warlock: ['DESTRUCTION', 'AFFLICTION', 'DEMONOLOGY'],
		Rogue: ['ASSASINATION', 'SUBTLETY', 'OUTLAW'],
		Hunter: ['BEAST MASTERY', 'MARKSMANSHIP', 'SURVIVAL'],
	},
};

export const ref = firebase.database().ref();
export const auth = firebase.auth();
export const googleProvider = firebase.auth.GoogleAuthProvider.PROVIDER_ID;
export const emailProvider = firebase.auth.EmailAuthProvider.PROVIDER_ID;
