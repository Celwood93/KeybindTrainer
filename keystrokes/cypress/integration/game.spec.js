describe('Tests for the Game', () => {
	it('authenticates', () => {
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
