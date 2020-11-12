describe('Tests for Talent Calculator', () => {
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

	describe('Test for Normal Talent Calculator', () => {
		it('should have active talent spells shows up in keybinding options', () => {
			cy.contains('Character Management').click();
			cy.contains('TestCharacter1').click();

			cy.get('#panel1a-header-talents').click();
			cy.get('#talent-container-223306').click(); //bestow faith

			cy.get('#keybind-edit-button').click();
			cy.contains('Manual').click();

			cy.get('#spell-selector').click();
			cy.get('#BestowFaith-option').click();
			cy.get('#spell-selector').should('have.text', 'Bestow Faith');
			cy.contains('Cancel').click();
		});
		it('should not have passive talent spells show up in keybinding options', () => {
			cy.contains('Character Management').click();
			cy.contains('TestCharacter1').click();

			cy.get('#panel1a-header-talents').click();
			cy.get('#talent-container-196926').click(); //Crusader's Might

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
							.should('not.have.text', "Crusader's Might");
					}
				});

			cy.get('#BeaconofLight-option').click();
			cy.contains('Cancel').click();
		});
		it('should disable a keybinding if it uses a spell that is deselected from the normal talent calculator and returns if its reselected', () => {
			cy.contains('Character Management').click();
			cy.contains('TestCharacter1').click();

			cy.get('#panel1a-header-talents').click();
			cy.get('#talent-container-216331').click(); //Avenging Crusader

			cy.get('#keybind-edit-button').click();
			cy.contains('Manual').click();

			cy.get('#spell-selector').click();
			cy.get('#AvengingCrusader-option').click();

			cy.get('#target-selector').click();
			cy.get('#Self-option').click();

			cy.get('#modifier-selector').click();
			cy.get('#None-option').click();

			cy.get('#keystroke-selector')
				.click()
				.type('a')
				.blur();
			cy.contains('Enter').click();
			cy.contains('Apply').click();
			cy.get('#panel1a-header-keybinds').click();

			cy.get('#HolyShock-no-edit-display-row')
				.parent()
				.parent()
				.children()
				.its('length')
				.should('be.eq', 5);

			cy.get('#talent-container-248033').click(); //Awakening

			cy.get('#HolyShock-no-edit-display-row')
				.parent()
				.parent()
				.children()
				.its('length')
				.should('be.eq', 4);

			cy.get('#talent-container-216331').click(); //Avenging Crusader

			cy.get('#HolyShock-no-edit-display-row')
				.parent()
				.parent()
				.children()
				.its('length')
				.should('be.eq', 5);
		});
		it(
			'should have spells that are replaced by talent choices disappear from keybinding selection options when' +
				'those talents are selected and reappear in keybinding selection options when the corresponding talent is deselected',
			() => {
				cy.contains('Character Management').click();
				cy.contains('TestCharacter1').click();

				cy.get('#keybind-edit-button').click();
				cy.contains('Manual').click();

				cy.get('#spell-selector').click();
				cy.get('#AvengingWrath-option').click();
				cy.contains('Cancel').click();

				cy.get('#panel1a-header-talents').click();
				cy.get('#talent-container-216331').click(); //Avenging Crusader

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
								.should('not.have.text', 'Avenging Wrath');
						}
					});

				cy.get('#BeaconofLight-option').click();
				cy.contains('Cancel').click();
			}
		);

		it(
			'should have spells that are replaced by talent choices disappear from keybindings when those talents are' +
				'selected and reappear in keybindings when the corresponding talent is deselected',
			() => {
				cy.contains('Character Management').click();
				cy.contains('TestCharacter1').click();

				cy.get('#keybind-edit-button').click();
				cy.contains('Manual').click();

				cy.get('#spell-selector').click();
				cy.get('#AvengingWrath-option').click();

				cy.get('#target-selector').click();
				cy.get('#Self-option').click();

				cy.get('#modifier-selector').click();
				cy.get('#None-option').click();

				cy.get('#keystroke-selector')
					.click()
					.type('a')
					.blur();
				cy.contains('Enter').click();
				cy.contains('Apply').click();
				cy.get('#panel1a-header-keybinds').click();

				cy.get('#HolyShock-no-edit-display-row')
					.parent()
					.parent()
					.children()
					.its('length')
					.should('be.eq', 5);

				cy.get('#panel1a-header-talents').click();
				cy.get('#talent-container-216331').click(); //Avenging Crusader

				cy.get('#HolyShock-no-edit-display-row')
					.parent()
					.parent()
					.children()
					.its('length')
					.should('be.eq', 4);

				cy.get('#talent-container-248033').click(); //Awakening

				cy.get('#HolyShock-no-edit-display-row')
					.parent()
					.parent()
					.children()
					.its('length')
					.should('be.eq', 5);
			}
		);
		it(
			'should add corresponding additional spells if the talent adds spells in the keybinding' +
				'selection, and remove them if corresponding talent is deselected',
			() => {
				cy.contains('Character Management').click();
				cy.contains('TestCharacter2').click();

				cy.get('#panel1a-header-talents').click();
				cy.get('#talent-container-197491').click(); //Guardian affinity for resto

				cy.get('#keybind-edit-button').click();
				cy.contains('Manual').click();

				cy.get('#spell-selector').click();
				cy.get('#Thrash-option').click();
				cy.get('#spell-selector').should('have.text', 'Thrash');
				cy.get('#spell-selector').click();
				cy.get('#FrenziedRegeneration-option').click();
				cy.get('#spell-selector').should(
					'have.text',
					'Frenzied Regeneration'
				);
				cy.get('#spell-selector').click();
				cy.get('#IncapacitatingRoar-option').click();
				cy.get('#spell-selector').should(
					'have.text',
					'Incapacitating Roar'
				);
				cy.contains('Cancel').click();

				cy.get('#talent-container-197491').rightclick(); //Guardian affinity for resto

				cy.get('#keybind-edit-button').click();
				cy.contains('Manual').click();

				cy.get('#spell-selector').click();
				cy.get('#EntanglingRoots-option')
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
								.should('not.have.text', 'Thrash')
								.and('not.have.text', 'Frenzied Regeneration')
								.and('not.have.text', 'Incapacitating Roar');
						}
					});

				cy.get('#EntanglingRoots-option').click();
				cy.contains('Cancel').click();
			}
		);
		it('should disable all additional spells in keybindings that the talent adds when deselected', () => {
			cy.contains('Character Management').click();
			cy.contains('TestCharacter2').click();

			cy.get('#panel1a-header-talents').click();
			cy.get('#talent-container-197491').click(); //Guardian affinity for resto

			cy.get('#keybind-edit-button').click();
			cy.contains('Manual').click();

			cy.get('#spell-selector').click();
			cy.get('#Thrash-option').click();

			cy.get('#target-selector').click();
			cy.get('#Self-option').click();

			cy.get('#modifier-selector').click();
			cy.get('#None-option').click();

			cy.get('#keystroke-selector')
				.click()
				.type('a')
				.blur();
			cy.contains('Enter').click();
			cy.get('#spell-selector').click();
			cy.get('#FrenziedRegeneration-option').click();

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

			cy.get('#panel1a-header-keybinds').click();

			cy.get('#Lifebloom-no-edit-display-row')
				.parent()
				.parent()
				.children()
				.its('length')
				.should('be.eq', 5);

			cy.get('#talent-container-197490').click(); //Feral affinity for resto

			cy.get('#Lifebloom-no-edit-display-row')
				.parent()
				.parent()
				.children()
				.its('length')
				.should('be.eq', 3);

			cy.get('#talent-container-197491').click(); //Guardian Affinity for resto

			cy.get('#Lifebloom-no-edit-display-row')
				.parent()
				.parent()
				.children()
				.its('length')
				.should('be.eq', 5);
		});
		it(
			'should prompt for the user to confirm replacing a disabled keybinding when creating a new keybinding' +
				'that shares the disabled keybindings modifier and key',
			() => {
				cy.contains('Character Management').click();
				cy.contains('TestCharacter2').click();

				cy.get('#panel1a-header-talents').click();
				cy.get('#talent-container-197491').click(); //Guardian affinity for resto

				cy.get('#keybind-edit-button').click();
				cy.contains('Manual').click();

				cy.get('#spell-selector').click();
				cy.get('#Thrash-option').click();

				cy.get('#target-selector').click();
				cy.get('#Self-option').click();

				cy.get('#modifier-selector').click();
				cy.get('#None-option').click();

				cy.get('#keystroke-selector')
					.click()
					.type('a')
					.blur();
				cy.contains('Enter').click();
				cy.contains('Apply').click();

				cy.get('#panel1a-header-keybinds').click();

				cy.get('#Lifebloom-no-edit-display-row')
					.parent()
					.parent()
					.children()
					.its('length')
					.should('be.eq', 4);

				cy.get('#talent-container-197490').click(); //Feral affinity for resto

				cy.get('#Lifebloom-no-edit-display-row')
					.parent()
					.parent()
					.children()
					.its('length')
					.should('be.eq', 3);

				cy.get('#keybind-edit-button').click();
				cy.contains('Manual').click();

				cy.get('#spell-selector').click();
				cy.get('#EntanglingRoots-option').click();

				cy.get('#target-selector').click();
				cy.get('#Target-option').click();

				cy.get('#modifier-selector').click();
				cy.get('#None-option').click();

				cy.get('#keystroke-selector')
					.click()
					.type('a')
					.blur();
				cy.contains('Enter').click();
				cy.get('#warning-modal-items').should('be.visible');
				cy.get('#warning-modal-items').should(
					'have.text',
					'Currently Disabled: Thrash Self None a'
				);
				cy.contains('Confirm').click();
				cy.contains('Apply').click();

				cy.get('#talent-container-197491').click(); //Guardian affinity for resto
				cy.get('#Lifebloom-no-edit-display-row')
					.parent()
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
								.should('not.have.text', 'Thrash')
								.and('not.have.text', 'Frenzied Regeneration')
								.and('not.have.text', 'Incapacitating Roar');
						}
					});
			}
		);
	});
});
