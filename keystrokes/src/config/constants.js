import firebase from 'firebase';

const config = {
	apiKey: 'AIzaSyDIKqaQX9sWRkCY2WIvIDrVGEzYWtPeLEQ',
	databaseURL: 'https://keystrokes-eb786.firebaseio.com',
    authDomain: "keystrokes-eb786.firebaseapp.com",
	projectId: 'keystrokes-eb786',
};
firebase.initializeApp(config);

export const ref = firebase.database().ref();
export const auth = firebase.auth();
export const googleProvider = firebase.auth.GoogleAuthProvider.PROVIDER_ID;
export const emailProvider = firebase.auth.EmailAuthProvider.PROVIDER_ID;
