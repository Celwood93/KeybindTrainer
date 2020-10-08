describe('Tests for the Game with valid keybinds', () => {
	it('authenticates', () => {
		cy.logout();
		cy.visit('/');
		cy.login('ILHEEvO7wmWa0r7xtHqMmmQ3vxe2'); //might want to put this somewhere else
		cy.contains('LandingPage');
	});

	describe('play the game', () => {
		beforeEach(() => {
			cy.contains('GamePage').click();
		});

		it('travels to the game page', () => {
			cy.url().should('include', '/Game');
		});

		it('presses the wrong key', () => {
			cy.get('#keybind-prompt').type('{alt}b'); //just has to be a keybinding that doesnt exist
			cy.get('#failed-prompt').then(obj => {
				const correctBinding = obj.text();
				const keybind = correctBinding
					.replace(/correct keybinding: /, '')
					.split(' ');
				cy.get('#keybind-prompt').type(
					`{${keybind[0] === 'None' ? '' : keybind[0]}}${keybind[1]}`
				);
				cy.get('#failed-prompt').should('not.be.visible');
			});
		});
	});
});

describe('Tests for the game with a empty user', () => {
	it('authenticates a different account', () => {
		cy.logout();
		cy.visit('/');
		cy.login('JgxSAHHAOzONr1wdD74zwlrtGee2'); //might want to put this somewhere else
		cy.contains('LandingPage');
	});

	describe('A user without a selected character should prompt a popup when attempting to play the game', () => {
		beforeEach(() => {
			cy.contains('GamePage').click();
		});
		it('alert should pop up', () => {
			cy.get('#keybind-prompt').type('{alt}b');
			cy.get('#alert-link').should('be.visible');
		});

		it('clicking the alert should take you to the character list page', () => {
			cy.get('#keybind-prompt').type('{alt}b');
			cy.get('#alert-link').click();
			cy.contains('Character List');
			cy.logout();
		});
	});
});
