describe('Tests for Manual Keybind Inputs', () => {
	it('authenticates', () => {
		cy.logout();
		cy.visit('/');
		cy.login('ILHEEvO7wmWa0r7xtHqMmmQ3vxe2'); //might want to put this somewhere else
		cy.contains('LandingPage');
	});
	before(() => {
		cy.resetDB();
	});
	describe('Navigate to the editor', () => {
		it('should navigate to the editor and enter the keys in', () => {
			cy.contains('Character Management').click();
			cy.contains('TestCharacter1').click();

			cy.get('#keybind-edit-button').click();
			cy.contains('Manual').click();

			cy.get('#spell-selector').click();
			cy.get('#Judgement-option').click();
			cy.get('#spell-selector').should('have.text', 'Judgement');

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

			cy.contains('Judgement')
				.parent()
				.children()
				.its('length')
				.should('be.eq', 5);

			cy.contains('Apply').click();
			cy.get('#panel1a-header-keybinds').click();
			cy.contains('Judgement')
				.parent()
				.parent()
				.children()
				.its('length')
				.should('be.eq', 5);
		});
		it('should not be able to enter if there are missing values', () => {
			cy.contains('Character Management').click();
			cy.contains('TestCharacter1').click();

			cy.get('#keybind-edit-button').click();
			cy.contains('Manual').click();

			cy.contains('Enter').should('be.disabled');

			cy.get('#spell-selector').click();
			cy.get('#Judgement-option').click();

			cy.contains('Enter').should('be.disabled');

			cy.get('#target-selector').click();
			cy.get('#Target-option').click();

			cy.contains('Enter').should('be.disabled');

			cy.get('#modifier-selector').click();
			cy.get('#None-option').click();

			cy.contains('Enter').should('be.disabled');

			cy.get('#keystroke-selector')
				.click()
				.type('k')
				.blur();

			cy.contains('Enter').should('be.enabled');
			cy.contains('Cancel').click();
		});
	});
	describe('Filling in the inputs should pop up the correct information next to the option', () => {
		it('shows the correct information next to the spells', () => {
			cy.contains('Character Management').click();
			cy.contains('TestCharacter1').click();

			cy.get('#keybind-edit-button').click();
			cy.contains('Manual').click();

			cy.get('#spell-selector').click();
			cy.get('#BeaconofLight-option')
				.parent()
				.parent()
				.parent()
				.parent()
				.children()
				.within(ele => {
					cy.wrap(ele)
						.eq(1)
						.children();
				});
		});
		it('shows information based on what keybinbds are taken next to the target option', () => {});
	});
	describe('Doing an already existing Spell / Target will cause a warning', () => {
		it('should cause a warning with correct conflicting keybind with a conflicting Spell and Target', () => {});
		it('should cause a warning with correct conflicting keybind with a conflicting Modifer and Key', () => {});
		it(
			'should cause a warning with both correct conflicting keybinds when Spell and Target conflict with a different keybind then Modifier and Key do'
		);
	});
	describe('Clicking enter while having conflicting spells will trigger a confirmation modal with all spells listed', () => {});
	describe('Clicking edit should not prompt the warning, but changing it to a existing mod/key will cause the warning and delete the conflicting keybind', () => {});
});
