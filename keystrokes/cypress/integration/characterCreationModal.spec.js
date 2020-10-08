import { characterDetails } from '../../src/config/constants';
describe('Tests for CharacterCreationModal', () => {
	it('authenticates', () => {
		cy.logout();
		cy.visit('/');
		cy.login('ILHEEvO7wmWa0r7xtHqMmmQ3vxe2'); //might want to put this somewhere else
		cy.contains('LandingPage');
	});

	describe('Using CharacterCreationModal', () => {
		beforeEach(() => {
			cy.contains('Character Management').click();
			cy.contains('Create A New Character').click();
		});

		it('should have opened a modal on click', () => {
			cy.contains('Cancel').click();
		});

		it('Should properly enter a name', () => {
			cy.get('#CharacterNameInput')
				.click()
				.type('TestName');
			cy.get('#CharacterNameInput').should('have.value', 'TestName');
			cy.get('#CharacterSpecInput').should('have.class', 'Mui-disabled');
			cy.contains('Submit').should('be.disabled');
			cy.contains('Cancel').click();
		});

		it('Should properly enter a race', () => {
			cy.get('#CharacterRaceInput').click();
			cy.get('#Human-option')
				.parent()
				.children()
				.its('length')
				.should('eq', characterDetails.race.length);
			cy.get('#Human-option').click();
			cy.get('#CharacterRaceInput').should('have.text', 'Human');
			cy.get('#CharacterSpecInput').should('have.class', 'Mui-disabled');
			cy.contains('Submit').should('be.disabled');
			cy.contains('Cancel').click();
		});
		it('Should properly enter a class', () => {
			cy.get('#CharacterClassInput').click();
			cy.get('#Druid-option')
				.parent()
				.children()
				.its('length')
				.should('eq', Object.keys(characterDetails.class).length);
			cy.get('#Druid-option').click();
			cy.get('#CharacterClassInput').should('have.text', 'Druid');
			cy.get('#CharacterSpecInput').should(
				'not.have.class',
				'Mui-disabled'
			);
			cy.contains('Submit').should('be.disabled');
			cy.contains('Cancel').click();
		});

		it('Should properly enter a spec', () => {
			cy.get('#CharacterClassInput').click();
			cy.get(`#Druid-option`).click();
			cy.get('#CharacterSpecInput').click();
			cy.get(`#${characterDetails.class['Druid'][1]}-option`)
				.parent()
				.children()
				.its('length')
				.should('eq', characterDetails.class['Druid'].length);
			cy.get(`#${characterDetails.class['Druid'][1]}-option`).click();

			cy.get('#CharacterSpecInput').should(
				'have.text',
				characterDetails.class['Druid'][1]
			);
			cy.contains('Submit').should('be.disabled');
			cy.contains('Cancel').click();
		});

		it('Should properly submit when it is all filled out', () => {
			cy.get('#CharacterNameInput')
				.click()
				.type('TestName');
			cy.get('#CharacterRaceInput').click();
			cy.get('#NightElf-option').click();
			cy.get('#CharacterClassInput').click();
			cy.get('#Druid-option').click();
			cy.get('#CharacterSpecInput').click();
			cy.get(`#${characterDetails.class['Druid'][1]}-option`).click();
			cy.contains('Submit').should('be.enabled');
			cy.contains('Submit').click();
			cy.url().should(
				'include',
				'%7B%22characterClass%22:%22Druid%22,%22name%22:%22TestName%22,%22spec%22:1,%22race%22:%22Night%20Elf%22%7D'
			);
		});
	});
});
