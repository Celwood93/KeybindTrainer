import firebase from 'firebase';

const config = {
	apiKey: 'AIzaSyDIKqaQX9sWRkCY2WIvIDrVGEzYWtPeLEQ',
	databaseURL: 'https://keystrokes-eb786.firebaseio.com',
	projectId: 'keystrokes-eb786',
};
firebase.initializeApp(config);

export const ref = firebase.database().ref();