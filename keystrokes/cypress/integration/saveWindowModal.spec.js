describe('Tests for Save Modal', () => {
	Cypress.config('defaultCommandTimeout', 10000);
	it('authenticates', () => {
		cy.logout();
		cy.visit('/');
		cy.login('ILHEEvO7wmWa0r7xtHqMmmQ3vxe2'); //might want to put this somewhere else
		cy.contains('LandingPage');
	});
	beforeEach(() => {
		cy.resetDB();
	});

	it('should pop up when navigating away from an existing character and successfully save', () => {
		cy.contains('Character Management').click();
		cy.contains('TestCharacter1').click();

		setUpData();
		cy.contains('Character Management').click();
		cy.get('#unsavedCharacterModal')
			.should('be.visible')
			.contains('Character Details and Keybindings');
		cy.get('#unsavedModalSaveButton').click();
		cy.contains('TestCharacter1').click();

		cy.get('#description-text').should(
			'have.text',
			'test description additional text'
		);
		cy.get('#panel1a-header-talents').click();
		cy.get('#talent-container-Venthyr').should(
			'have.css',
			'border',
			'2px solid rgb(176, 143, 0)'
		);
		cy.get('#panel1a-header-keybinds').click();
		cy.get('#keybind-row-container')
			.eq(0)
			.should('have.text', 'JudgmentTargetNonek');
	});
	it('should pop up when navigating away from an existing character and successfully discard', () => {
		cy.contains('Character Management').click();
		cy.contains('TestCharacter1').click();

		setUpData();
		cy.contains('Character Management').click();
		cy.get('#unsavedCharacterModal')
			.should('be.visible')
			.contains('Character Details and Keybindings');
		cy.get('#unsavedModalDiscardButton').click();
		cy.contains('TestCharacter1').click();

		cy.get('#description-text').should('have.text', 'test description');
		cy.get('#panel1a-header-talents').click();
		cy.get('#talent-container-Venthyr').should(
			'have.css',
			'border',
			'2px solid rgb(128, 128, 128)'
		);
		cy.get('#panel1a-header-keybinds').click();
		cy.get('#keybind-row-container')
			.eq(0)
			.should('not.have.text', 'JudgmentTargetNonek');
	});
	it('should pop up when visiting a different player page through a url and successfully save', () => {
		cy.contains('Character Management').click();
		cy.contains('TestCharacter1').click();

		setUpData();

		cy.visit('http://localhost:3000/CharacterList/-MFRzhiMGk3SHMzLqnhv');
		cy.get('#unsavedCharacterModal')
			.should('be.visible')
			.contains('Character Details and Keybindings');
		cy.get('#unsavedModalSaveButton').click();
		cy.contains('Character Management').click();
		cy.contains('TestCharacter1').click();

		cy.get('#description-text').should(
			'have.text',
			'test description additional text'
		);
		cy.get('#panel1a-header-talents').click();
		cy.get('#talent-container-Venthyr').should(
			'have.css',
			'border',
			'2px solid rgb(176, 143, 0)'
		);
		cy.get('#panel1a-header-keybinds').click();
		cy.get('#keybind-row-container')
			.eq(0)
			.should('have.text', 'JudgmentTargetNonek');
	});
	it('should pop up when on a new character and properly save', () => {
		cy.visit(
			'http://localhost:3000/CharacterList/-MMHC0vmSyy19FQS6JuT/%7B"characterClass":"Paladin","name":"bruce","spec":0,"race":"Tauren"%7D'
		);

		setUpData();
		cy.contains('Character Management').click();
		cy.get('#unsavedCharacterModal')
			.should('be.visible')
			.contains('Character Details and Keybindings');

		cy.get('#unsavedModalSaveButton').click();
		cy.contains('Character Management').click();
		cy.contains('bruce').click();

		cy.get('#description-text').should('have.text', ' additional text');
		cy.get('#panel1a-header-talents').click();
		cy.get('#talent-container-Venthyr').should(
			'have.css',
			'border',
			'2px solid rgb(176, 143, 0)'
		);
		cy.get('#panel1a-header-keybinds').click();
		cy.get('#keybind-row-container')
			.eq(0)
			.should('have.text', 'JudgmentTargetNonek');
	});
	it('should pop up when on a new character and properly discard', () => {
		cy.visit(
			'http://localhost:3000/CharacterList/-MMHC0vmSyy19FQS6JuT/%7B"characterClass":"Paladin","name":"bruce","spec":0,"race":"Tauren"%7D'
		);

		setUpData();
		cy.contains('Character Management').click();
		cy.get('#unsavedCharacterModal')
			.should('be.visible')
			.contains('Character Details and Keybindings');
		cy.get('#unsavedModalDiscardButton').click();
		cy.get('#-MFRzQ_dAXSsJKERlHEw')
			.parent()
			.children()
			.its('length')
			.should('be.eq', 5); //1 extra for the divider
	});
	it('should pop up when visiting a new player, and that player should now be covered if anything changes', () => {
		cy.visit(
			'http://localhost:3000/CharacterList/-MMHC0vmSyy19FQS6JuT/%7B"characterClass":"Paladin","name":"bruce","spec":0,"race":"Tauren"%7D'
		);

		setUpData();
		cy.visit('http://localhost:3000/CharacterList/-MFRzQ_dAXSsJKERlHEw');
		cy.get('#unsavedCharacterModal')
			.should('be.visible')
			.contains('Character Details and Keybindings');
		cy.get('#unsavedModalDiscardButton').click();
		setUpData();
		cy.contains('Character Management').click();
		cy.get('#unsavedCharacterModal')
			.should('be.visible')
			.contains('Character Details and Keybindings');
		cy.get('#unsavedModalSaveButton').click();
		cy.contains('TestCharacter1').click();

		cy.get('#description-text').should(
			'have.text',
			'test description additional text'
		);
		cy.get('#panel1a-header-talents').click();
		cy.get('#talent-container-Venthyr').should(
			'have.css',
			'border',
			'2px solid rgb(176, 143, 0)'
		);
		cy.get('#panel1a-header-keybinds').click();
		cy.get('#keybind-row-container')
			.eq(0)
			.should('have.text', 'JudgmentTargetNonek');
	});

	function setUpData() {
		cy.get('#keybind-edit-button').click();
		cy.contains('Manual').click();

		cy.get('#spell-selector').click();
		cy.get('#Judgment-option').click();
		cy.get('#spell-selector').should('have.text', 'Judgment');

		cy.get('#target-selector').click();
		cy.get('#Target-option').click();
		cy.get('#target-selector').should('have.text', 'Target');

		cy.get('#modifier-selector').click();
		cy.get('#None-option').click();
		cy.get('#modifier-selector').should('have.text', 'None');

		cy.get('#keystroke-selector')
			.click()
			.type('k')
			.blur();
		cy.get('#keystroke-selector').should('have.value', 'k');

		cy.contains('Enter').click();
		cy.contains('Apply').click();

		cy.get('#panel1a-header-talents').click();
		cy.get('#talent-container-Venthyr').click();
		cy.get('#panel1a-header-talents').click();

		cy.get('#description-edit-button').click();
		cy.get('#description-edit-area').click();
		cy.get('.ql-editor').type(' additional text');
		cy.get('#description-save-button').click();
	}
});
