// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import firebase from 'firebase/app';
import seedDB from '../../test-db-seed/database_export/keystrokes-eb786.json';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
import { attachCustomCommands } from 'cypress-firebase';
const serviceAccount = require('../../serviceAccount.json');
const admin = require('firebase-admin');

const fbConfig = {
	apiKey: 'AIzaSyDIKqaQX9sWRkCY2WIvIDrVGEzYWtPeLEQ',
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'http://localhost:9000?ns=keystrokes-eb786',
};

firebase.initializeApp(fbConfig);

Cypress.Commands.add('resetDB', () => {
	firebase
		.database()
		.ref()
		.set(seedDB);
});
attachCustomCommands({ Cypress, cy, firebase });
