describe('Tests for Manual Keybind Inputs', () => {
	Cypress.config('defaultCommandTimeout', 10000);
	it('authenticates', () => {
		cy.logout();
		cy.visit('/');
		cy.login('ILHEEvO7wmWa0r7xtHqMmmQ3vxe2'); //might want to put this somewhere else
		cy.contains('LandingPage');
	});
	before(() => {
		cy.resetDB();
	});
	const conflictingBinds = [
		'Hammer of Justice Arena3 Ctrl r',
		'Holy Shock Target None j',
	];

	const names = [
		'Hammer of JusticeArena3Nonej',
		'Hammer of JusticeArena2Shiftr',
		'Hammer of JusticeArena1Noner',
	];
	describe('Navigate to the editor', () => {
		it('should navigate to the editor and enter the keys in', () => {
			cy.contains('Character Management').click();
			cy.contains('TestCharacter1').click();

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

			cy.get('#Judgment-edit-display-row')
				.parent()
				.parent()
				.children()
				.its('length')
				.should('be.eq', 5);

			cy.contains('Apply').click();
			cy.get('#panel1a-header-keybinds').click();
			cy.get('#Judgment-no-edit-display-row')
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
			cy.get('#Judgment-option').click();

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
			const HOJValues = [
				'Arena3 Ctrl r',
				'Arena2 Shift r',
				'Arena1 None r',
			];
			cy.contains('Character Management').click();
			cy.contains('TestCharacter1').click();

			cy.get('#keybind-edit-button').click();
			cy.contains('Manual').click();

			cy.get('#spell-selector').click();
			cy.get('#BeaconofLight-option')
				.parent()
				.children()
				.within(ele => {
					for (let i = 0; i < ele.length; i++) {
						cy.wrap(ele)
							.eq(i)
							.children()
							.children()
							.as('row')
							.eq(1)
							.within(rowSpellName => {
								if (
									rowSpellName.text() ===
										'Hammer of Justice' ||
									rowSpellName.text() === 'Holy Shock'
								) {
									cy.get('@row')
										.eq(2)
										.children()
										.should('have.css', 'background-color')
										.and('eq', 'rgb(76, 175, 80)');
								} else {
									cy.get('@row')
										.eq(2)
										.children()
										.should('have.css', 'background-color')
										.and('eq', 'rgb(233, 30, 99)');
								}
							});
					}
				});
			cy.get('#HammerofJustice-status').trigger('mouseover');
			cy.get('#HammerofJustice-popup').should('be.visible');
			cy.get('#HammerofJustice-popup')
				.children()
				.children()
				.eq(1)
				.within(listItem => {
					for (let i = 0; i < HOJValues.length; i++) {
						cy.wrap(listItem)
							.children()
							.eq(i)
							.should('have.text', HOJValues[i]);
					}
				});

			cy.get('#HammerofJustice-option').click();
			cy.contains('Cancel').click();
		});
		it('shows information based on what keybinbds are taken next to the target option', () => {
			cy.contains('Character Management').click();
			cy.contains('TestCharacter1').click();

			cy.get('#keybind-edit-button').click();
			cy.contains('Manual').click();

			cy.get('#spell-selector').click();
			cy.get('#HammerofJustice-option').click();
			cy.get('#target-selector').click();

			cy.get('#Target-option')
				.parent()
				.children()
				.within(ele => {
					for (let i = 0; i < ele.length; i++) {
						cy.wrap(ele)
							.eq(i)
							.children()
							.children()
							.as('row')
							.eq(0)
							.within(rowSpellName => {
								if (
									rowSpellName.text() === 'Target' ||
									rowSpellName.text() === 'Focus'
								) {
									cy.get('@row')
										.eq(1)
										.children()
										.eq(0)
										.should('have.css', 'background-color')
										.and('eq', 'rgb(233, 30, 99)');
								} else {
									cy.get('@row')
										.eq(1)
										.children()
										.eq(0)
										.should('have.css', 'background-color')
										.and('eq', 'rgb(76, 175, 80)');
								}
							});
					}
				});
			cy.get('#Arena1-status').trigger('mouseover');
			cy.get('#Arena1-popup').should('be.visible');
			cy.get('#Arena1-popup').should(
				'have.text',
				'Already set for keybinding: None r'
			);

			cy.get('#Arena2-status').trigger('mouseover');
			cy.get('#Arena2-popup').should('be.visible');
			cy.get('#Arena2-popup').should(
				'have.text',
				'Already set for keybinding: Shift r'
			);

			cy.get('#Arena3-status').trigger('mouseover');
			cy.get('#Arena3-popup').should('be.visible');
			cy.get('#Arena3-popup').should(
				'have.text',
				'Already set for keybinding: Ctrl r'
			);
			cy.get('#Arena3-option').click();
			cy.contains('Cancel').click();
		});
	});
	describe('Doing an already existing Spell / Target will cause a warning', () => {
		it('should cause a warning with correct conflicting keybind with a conflicting Spell and Target', () => {
			cy.contains('Character Management').click();
			cy.contains('TestCharacter1').click();

			cy.get('#keybind-edit-button').click();
			cy.contains('Manual').click();

			cy.get('#spell-selector').click();
			cy.get('#HammerofJustice-option').click();
			cy.get('#target-selector').click();
			cy.get('#Arena3-option').click();
			cy.get('#Invalid-bind-warning').should('be.visible');
			cy.get('#Invalid-bind-warning').trigger('mouseover');
			cy.get('#Invalid-bind-warning-popup').should('be.visible');
			cy.get('#Invalid-bind-warning-popup')
				.children()
				.children()
				.eq(1)
				.should('have.text', conflictingBinds[0]);
			cy.contains('Cancel').click();
		});
		it('should cause a warning with correct conflicting keybind with a conflicting Modifer and Key', () => {
			cy.contains('Character Management').click();
			cy.contains('TestCharacter1').click();

			cy.get('#keybind-edit-button').click();
			cy.contains('Manual').click();

			cy.get('#spell-selector').click();
			cy.get('#HammerofJustice-option').click();
			cy.get('#target-selector').click();
			cy.get('#Target-option').click();
			cy.get('#modifier-selector').click();
			cy.get('#None-option').click();
			cy.get('#keystroke-selector')
				.click()
				.type('j')
				.blur();
			cy.get('#Invalid-bind-warning').should('be.visible');
			cy.get('#Invalid-bind-warning').trigger('mouseover');
			cy.get('#Invalid-bind-warning-popup').should('be.visible');
			cy.get('#Invalid-bind-warning-popup')
				.children()
				.children()
				.eq(1)
				.should('have.text', conflictingBinds[1]);
			cy.contains('Cancel').click();
		});
		it(
			'should cause a warning with both correct conflicting keybinds' +
				'when Spell and Target conflict with a different keybind then Modifier and Key do',
			() => {
				cy.contains('Character Management').click();
				cy.contains('TestCharacter1').click();

				cy.get('#keybind-edit-button').click();
				cy.contains('Manual').click();

				cy.get('#spell-selector').click();
				cy.get('#HammerofJustice-option').click();
				cy.get('#target-selector').click();
				cy.get('#Arena3-option').click();
				cy.get('#modifier-selector').click();
				cy.get('#None-option').click();
				cy.get('#keystroke-selector')
					.click()
					.type('j')
					.blur();
				cy.get('#Invalid-bind-warning').should('be.visible');
				cy.get('#Invalid-bind-warning').trigger('mouseover');
				cy.get('#Invalid-bind-warning-popup').should('be.visible');
				cy.get('#Invalid-bind-warning-popup')
					.children()
					.children()
					.eq(1)
					.should(
						'have.text',
						conflictingBinds[1] + conflictingBinds[0]
					);
				cy.contains('Cancel').click();
			}
		);
	});
	describe('Clicking enter while having conflicting spells will trigger a confirmation modal with all spells listed', () => {
		it('Should have a trigger modal pop up with the expected error warnings and on confirm replaces the two keybinds', () => {
			cy.contains('Character Management').click();
			cy.contains('TestCharacter1').click();

			cy.get('#keybind-edit-button').click();
			cy.contains('Manual').click();

			cy.get('#spell-selector').click();
			cy.get('#HammerofJustice-option').click();
			cy.get('#target-selector').click();
			cy.get('#Arena3-option').click();
			cy.get('#modifier-selector').click();
			cy.get('#None-option').click();
			cy.get('#keystroke-selector')
				.click()
				.type('j')
				.blur();
			cy.contains('Enter').click();
			cy.get('#warning-modal-items').should('be.visible');
			cy.get('#warning-modal-items').should(
				'have.text',
				conflictingBinds[1] + conflictingBinds[0]
			);
			cy.contains('Confirm').click();
			cy.get('#HammerofJusticeArena3-edit')
				.parent()
				.parent()
				.parent()
				.parent()
				.parent()
				.parent()
				.children()
				.within(ele => {
					for (let i = 0; i < names.length; i++) {
						cy.wrap(ele)
							.eq(i)
							.within(ele2 => {
								cy.wrap(ele2)
									.eq(0)
									.should('have.text', names[i]);
							});
					}
				});
			cy.contains('Cancel').click();
		});
	});
	describe('Clicking edit should not prompt the warning, but changing it to a existing mod/key will cause the warning and delete the conflicting keybind', () => {
		it('should not conflict with edit, then replace a key during an edit event', () => {
			cy.contains('Character Management').click();
			cy.contains('TestCharacter1').click();

			cy.get('#keybind-edit-button').click();
			cy.contains('Manual').click();
			cy.get('#HammerofJusticeArena3-edit').click();
			cy.get('#Invalid-bind-warning').should('not.be.visible');
			cy.get('#modifier-selector').click();
			cy.get('#None-option').click();
			cy.get('#keystroke-selector')
				.click()
				.type('j')
				.blur();
			cy.get('#Invalid-bind-warning').should('be.visible');
			cy.contains('Enter').click();
			cy.get('#warning-modal-items').should(
				'have.text',
				conflictingBinds[1]
			);
			cy.contains('Confirm').click();
			cy.get('#HammerofJusticeArena3-edit')
				.parent()
				.parent()
				.parent()
				.parent()
				.parent()
				.parent()
				.children()
				.within(ele => {
					for (let i = 0; i < names.length; i++) {
						cy.wrap(ele)
							.eq(i)
							.within(ele2 => {
								cy.wrap(ele2)
									.eq(0)
									.should('have.text', names[i]);
							});
					}
				});
			cy.contains('Cancel').click();
		});
	});
});
