describe('Tests for the Game with valid keybinds', () => {
	it('authenticates', () => {
		cy.logout();
		cy.visit('/');
		cy.login('ILHEEvO7wmWa0r7xtHqMmmQ3vxe2'); //might want to put this somewhere else
		cy.contains('LandingPage');
	});
	before(() => {
		cy.resetDB();
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

describe('Test selecting different keybinds/specs/characters for the game.', () => {
	before(() => {
		cy.resetDB();
	});
	it('Should work with a different set of keybindings for the selected character', () => {
		cy.contains('Character Management').click();
		cy.contains('TestCharacter1').click();
		cy.contains('Create New Keybindings').click();
		cy.get('#keybind-edit-button').click();
		cy.contains('Manual').click();

		cy.get('#spell-selector').click();
		cy.get('#Judgment-option').click();

		cy.get('#target-selector').click();
		cy.get('#Target-option').click();

		cy.get('#modifier-selector').click();
		cy.get('#None-option').click();

		cy.get('#keystroke-selector')
			.click()
			.type('f')
			.blur();

		cy.contains('Enter').click();

		cy.get('#spell-selector').click();
		cy.get('#Judgment-option').click();

		cy.get('#target-selector').click();
		cy.get('#Arena1-option').click();

		cy.get('#modifier-selector').click();
		cy.get('#Shift-option').click();

		cy.get('#keystroke-selector')
			.click()
			.type('f')
			.blur();

		cy.contains('Enter').click();

		cy.get('#spell-selector').click();
		cy.get('#DivineShield-option').click();

		cy.get('#target-selector').click();
		cy.get('#Self-option').click();

		cy.get('#modifier-selector').click();
		cy.get('#None-option').click();

		cy.get('#keystroke-selector')
			.click()
			.type('d')
			.blur();

		cy.contains('Enter').click();

		cy.contains('Apply').click();
		cy.contains('SAVE').click();
		cy.contains('Select').click();

		cy.contains('GamePage').click();
		cy.get('#keybind-prompt').type('{alt}b'); //just has to be a keybinding that doesnt exist
		cy.get('#failed-prompt').then(obj => {
			const correctBinding = obj.text();
			const keybind = correctBinding
				.replace(/correct keybinding: /, '')
				.split(' ');
			cy.get('#keybind-prompt').type(
				`{${keybind[0] === 'None' ? '' : keybind[0]}}${keybind[1]}`
			);
		});

		cy.get('#keybind-prompt').type('{alt}b'); //just has to be a keybinding that doesnt exist
		cy.get('#failed-prompt').then(obj => {
			const correctBinding = obj.text();
			const keybind = correctBinding
				.replace(/correct keybinding: /, '')
				.split(' ');
			cy.get('#keybind-prompt').type(
				`{${keybind[0] === 'None' ? '' : keybind[0]}}${keybind[1]}`
			);
		});
	});
	it('Should work with a different spec for the selected keybindings', () => {
		cy.contains('Character Management').click();
		cy.contains('TestCharacter1').click();
		cy.get('#scrollable-auto-tab-RETRIBUTION').click();
		cy.get('#keybind-edit-button').click();
		cy.contains('Manual').click();

		cy.get('#spell-selector').click();
		cy.get('#HammerofWrath-option').click();

		cy.get('#target-selector').click();
		cy.get('#Target-option').click();

		cy.get('#modifier-selector').click();
		cy.get('#None-option').click();

		cy.get('#keystroke-selector')
			.click()
			.type('r')
			.blur();

		cy.contains('Enter').click();

		cy.get('#spell-selector').click();
		cy.get('#HammerofWrath-option').click();

		cy.get('#target-selector').click();
		cy.get('#Focus-option').click();

		cy.get('#modifier-selector').click();
		cy.get('#Shift-option').click();

		cy.get('#keystroke-selector')
			.click()
			.type('r')
			.blur();

		cy.contains('Enter').click();

		cy.get('#spell-selector').click();
		cy.get('#Rebuke-option').click();

		cy.get('#target-selector').click();
		cy.get('#Target-option').click();

		cy.get('#modifier-selector').click();
		cy.get('#None-option').click();

		cy.get('#keystroke-selector')
			.click()
			.type('d')
			.blur();

		cy.contains('Enter').click();

		cy.contains('Apply').click();
		cy.contains('SAVE').click();
		cy.contains('Select').click();

		cy.contains('GamePage').click();
		cy.get('#keybind-prompt').type('{alt}b'); //just has to be a keybinding that doesnt exist
		cy.get('#failed-prompt').then(obj => {
			const correctBinding = obj.text();
			const keybind = correctBinding
				.replace(/correct keybinding: /, '')
				.split(' ');
			cy.get('#keybind-prompt').type(
				`{${keybind[0] === 'None' ? '' : keybind[0]}}${keybind[1]}`
			);
		});

		cy.get('#keybind-prompt').type('{alt}b'); //just has to be a keybinding that doesnt exist
		cy.get('#failed-prompt').then(obj => {
			const correctBinding = obj.text();
			const keybind = correctBinding
				.replace(/correct keybinding: /, '')
				.split(' ');
			cy.get('#keybind-prompt').type(
				`{${keybind[0] === 'None' ? '' : keybind[0]}}${keybind[1]}`
			);
		});
	});
	it('Should work with a different Character for the selected keybindings', () => {
		cy.contains('Character Management').click();
		cy.contains('TestCharacter2').click();
		cy.contains('Select').click();

		cy.contains('GamePage').click();
		cy.get('#keybind-prompt').type('{alt}b'); //just has to be a keybinding that doesnt exist
		cy.get('#failed-prompt').then(obj => {
			const correctBinding = obj.text();
			const keybind = correctBinding
				.replace(/correct keybinding: /, '')
				.split(' ');
			cy.get('#keybind-prompt').type(
				`{${keybind[0] === 'None' ? '' : keybind[0]}}${keybind[1]}`
			);
		});

		cy.get('#keybind-prompt').type('{alt}b'); //just has to be a keybinding that doesnt exist
		cy.get('#failed-prompt').then(obj => {
			const correctBinding = obj.text();
			const keybind = correctBinding
				.replace(/correct keybinding: /, '')
				.split(' ');
			cy.get('#keybind-prompt').type(
				`{${keybind[0] === 'None' ? '' : keybind[0]}}${keybind[1]}`
			);
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
	before(() => {
		cy.resetDB();
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
