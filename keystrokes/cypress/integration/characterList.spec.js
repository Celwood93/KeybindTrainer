describe('Tests for CharacterList', () => {
	it('authenticates', () => {
		cy.logout();
		cy.visit('/');
		cy.login('ILHEEvO7wmWa0r7xtHqMmmQ3vxe2'); //might want to put this somewhere else
		cy.contains('LandingPage');
	});

	before(() => {
		cy.resetDB();
	});

	describe('Using character list', () => {
		beforeEach(() => {
			cy.contains('Character Management').click();
		});

		it('travels to the character list page', () => {
			cy.url().should('include', '/CharacterList');
		});

		it('Should have TestCharacter1 as selected', () => {
			cy.contains('TestCharacter1')
				.parent()
				.parent()
				.parent()
				.should(
					'have.class',
					'makeStyles-characterListItemSelected-15'
				);
		});

		it('Should have create new character', () => {
			cy.contains('Create A New Character')
				.parent()
				.parent()
				.parent()
				.should('have.class', 'makeStyles-newCharacterListItem-17');
		});

		it('Should have 4 options in the right order', () => {
			cy.get('.MuiList-root')
				.children()
				.its('length')
				.should('eq', 4 + 1); //the +1 is for the hr div at the bottom
			cy.get('.MuiList-root')
				.children()
				.first()
				.should('have.text', 'TestCharacter1');
			cy.get('.MuiList-root')
				.children()
				.first()
				.next()
				.should('have.text', 'TestCharacter3');
			cy.get('.MuiList-root')
				.children()
				.first()
				.next()
				.next()
				.should('have.text', 'TestCharacter2');
			cy.get('.MuiList-root')
				.children()
				.first()
				.next()
				.next()
				.next()
				.should('have.text', 'Create A New Character');
		});

		it('should update selected', () => {
			cy.contains('TestCharacter3').click();
			cy.contains('Select').click();
			cy.contains('Character Management').click();
			cy.contains('TestCharacter3')
				.parent()
				.parent()
				.parent()
				.should(
					'have.class',
					'makeStyles-characterListItemSelected-15'
				);
			cy.contains('TestCharacter1')
				.parent()
				.parent()
				.parent()
				.should('have.class', 'makeStyles-characterListItem-14');
		});
	});
});
