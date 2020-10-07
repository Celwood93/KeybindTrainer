import { characterDetails } from '../../src/config/constants';
describe('Tests for Character Detail Page', () => {
	it('authenticates', () => {
		cy.visit('/');
		cy.login('ILHEEvO7wmWa0r7xtHqMmmQ3vxe2'); //might want to put this somewhere else
		cy.contains('LandingPage');
	});
	before(() => {
		cy.resetDB();
	});
	describe('Testing initial interactions on characterDetailPage', () => {
		it('Should create the page with the specifications given', () => {
			cy.contains('Character Management').click();
			cy.contains('Create A New Character').click();
			cy.get('#CharacterNameInput')
				.click()
				.type('PriestTest');
			cy.get('#CharacterRaceInput').click();
			cy.get('#Human-option').click();
			cy.get('#CharacterClassInput').click();
			cy.get('#Priest-option').click();
			cy.get('#CharacterSpecInput').click();
			cy.get(`#${characterDetails.class['Priest'][0]}-option`).click();
			cy.contains('Submit').click();
			cy.contains('PriestTest');
			cy.contains('SAVE').click();
		});
		it('Should be saved to the character list', () => {
			cy.contains('Character Management').click();
			cy.get('.MuiList-root')
				.children()
				.its('length')
				.should('eq', 5 + 1); //the +1 is for the hr div at the bottom
			cy.contains('PriestTest').click();
			cy.contains('DISCIPLINE');
		});
		describe('Testing detailed interactions on the new character created', () => {
			it('Should have a description', () => {
				cy.contains('Character Management').click();
				cy.contains('PriestTest').click();
				cy.get('#description-edit-button').click();
				cy.get('#description-edit-area').click();
				cy.get('.ql-editor').then($span => {
					$span.text(
						'Keybindings 1 for discipline spec on priest test'
					);
				});

				cy.get('#description-save-button').click();
				cy.get('#description-text').should(
					'have.text',
					'Keybindings 1 for discipline spec on priest test'
				);
			});
			describe('Testing state between different specs and keybindings', () => {
				it('Should save state between different specs and keybinds', () => {
					cy.contains('Character Management').click();
					cy.contains('PriestTest').click();
					let specIndex;
					let keybindIndex;
					for (
						specIndex = 0;
						specIndex < characterDetails.class['Priest'].length;
						specIndex++
					) {
						cy.contains(
							characterDetails.class['Priest'][specIndex]
						).click();
						for (
							keybindIndex = 0;
							keybindIndex < 2;
							keybindIndex++
						) {
							const descriptionText = `Keybindings ${keybindIndex +
								1} for ${
								characterDetails.class['Priest'][specIndex]
							} spec on priest test`;
							cy.get('#description-edit-button').click();
							cy.get('#description-edit-area').click();
							cy.get('.ql-editor').then($span => {
								$span.text(descriptionText);
							});

							cy.get('#description-save-button').click();
							cy.get('#description-text').should(
								'have.text',
								descriptionText
							);
							if (keybindIndex < 1) {
								cy.contains('Create New Keybindings').click();
							}
						}
					}
					for (
						specIndex = 0;
						specIndex < characterDetails.class['Priest'].length;
						specIndex++
					) {
						cy.contains(
							characterDetails.class['Priest'][specIndex]
						).click();
						for (
							keybindIndex = 0;
							keybindIndex < 2;
							keybindIndex++
						) {
							cy.contains(
								`Keybindings-${keybindIndex + 1}`
							).click();
							const descriptionText = `Keybindings ${keybindIndex +
								1} for ${
								characterDetails.class['Priest'][specIndex]
							} spec on priest test`;
							cy.get('#description-text').should(
								'have.text',
								descriptionText
							);
						}
					}
				});
			});
		});
	});
});
