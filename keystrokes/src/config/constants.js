import firebase from 'firebase';

const config = {
	apiKey: 'AIzaSyDIKqaQX9sWRkCY2WIvIDrVGEzYWtPeLEQ',
	databaseURL: 'https://keystrokes-eb786.firebaseio.com',
    authDomain: "keystrokes-eb786.firebaseapp.com",
	projectId: 'keystrokes-eb786',
};
firebase.initializeApp(config);

export const characterDetails = {
	race: ["", "Night Elf", "Human", "Worgen", "Toren", "Blood Elf", "Orc", "Troll", "Undead", "Dwarf", "Gnome", "Goblin"],
	class: {
		"": [],
		Shaman: ["RESTORATION", "ELEMENTAL", "ENHANCEMENT"], 
		Monk: ["MISTWEAVER", "BREWMASTER", "WINDWALKER"], 
		Druid: ["FERAL", "RESTORATION", "GUARDIAN", "BALANCE"], 
		Paladin: ["PROTECTION", "HOLY", "RETRIBUTION"], 
		Priest: ["DISCIPLINE", "SHADOW", "HOLY"], 
		Mage: ["FIRE", "FROST", "ARCANE"], 
		Warrior: ["ARMS", "FURY", "PROTECTION"], 
		"Death Knight": ["BLOOD", "UNHOLY", "FROST"], 
		"Demon Hunter": ["HAVOC", "VENGEANCE"]
	},

}

export const ref = firebase.database().ref();
export const auth = firebase.auth();
export const googleProvider = firebase.auth.GoogleAuthProvider.PROVIDER_ID;
export const emailProvider = firebase.auth.EmailAuthProvider.PROVIDER_ID;
