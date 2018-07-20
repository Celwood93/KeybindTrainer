import firebase from 'firebase';

const config = {
	apiKey: 'AIzaSyCBeZaStvDTvqD6WCjZEBtA4UNHbCRTEAw',
	databaseURL: 'https://keybindtrainer.firebaseio.com',
	projectId: 'keybindtrainer',
};
firebase.initializeApp(config);

export const ref = firebase.database().ref();