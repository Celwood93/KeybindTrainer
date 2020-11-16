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
				cy.get('#talent-container-197491')
					.children()
					.children()
					.eq(0)
					.should('have.css', 'filter', 'grayscale(0)');

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
	describe('Test for Covenant Talent Calculator', () => {
		it('should have covenant spells shows up in keybinding options', () => {
			cy.contains('Character Management').click();
			cy.contains('TestCharacter1').click();

			cy.get('#panel1a-header-talents').click();
			cy.get('#talent-container-Venthyr').click();

			cy.get('#keybind-edit-button').click();
			cy.contains('Manual').click();

			cy.get('#spell-selector').click();
			cy.get('#AshenHallow-option').click();
			cy.get('#spell-selector').should('have.text', 'Ashen Hallow');
			cy.contains('Cancel').click();
		});
		it('should disable a keybinding if it uses a spell that is deselected from the covenant calculator and returns if its reselected', () => {
			cy.visit(
				'http://localhost:3000/CharacterList/-MMHC0vmSyy19FQS6JuT/%7B"characterClass":"Warrior","name":"bruce","spec":0,"race":"Tauren"%7D'
			);

			cy.get('#panel1a-header-talents').click();
			cy.get('#talent-container-Venthyr').click();

			cy.get('#keybind-edit-button').click();
			cy.contains('Manual').click();

			cy.get('#spell-selector').click();
			cy.get('#Slam-option').click();

			cy.get('#target-selector').click();
			cy.get('#Target-option').click();

			cy.get('#modifier-selector').click();
			cy.get('#None-option').click();

			cy.get('#keystroke-selector')
				.click()
				.type('d')
				.blur();
			cy.contains('Enter').click();

			cy.get('#spell-selector').click();
			cy.get('#Condemn-option').click();

			cy.get('#target-selector').click();
			cy.get('#Target-option').click();

			cy.get('#modifier-selector').click();
			cy.get('#None-option').click();

			cy.get('#keystroke-selector')
				.click()
				.type('a')
				.blur();
			cy.contains('Enter').click();
			cy.contains('Apply').click();
			cy.get('#panel1a-header-keybinds').click();

			cy.get('#Slam-no-edit-display-row')
				.parent()
				.parent()
				.children()
				.its('length')
				.should('be.eq', 2);

			cy.get('#talent-container-Kyrian').click();

			cy.get('#Slam-no-edit-display-row')
				.parent()
				.parent()
				.children()
				.its('length')
				.should('be.eq', 1);

			cy.get('#talent-container-Venthyr').click();

			cy.get('#Slam-no-edit-display-row')
				.parent()
				.parent()
				.children()
				.its('length')
				.should('be.eq', 2);
		});
		it(
			'should have spells that are replaced by a covenant spell disappear from keybinding selection options when' +
				'those talents are selected and reappear in keybinding selection options when the corresponding covenant is deselected',
			() => {
				cy.visit(
					'http://localhost:3000/CharacterList/-MMHC0vmSyy19FQS6JuT/%7B"characterClass":"Warrior","name":"bruce","spec":0,"race":"Tauren"%7D'
				);

				cy.get('#panel1a-header-talents').click();
				cy.get('#talent-container-Kyrian').click();

				cy.get('#keybind-edit-button').click();
				cy.contains('Manual').click();

				cy.get('#spell-selector').click();
				cy.get('#Execute-option').click();
				cy.contains('Cancel').click();

				cy.get('#talent-container-Venthyr').click();

				cy.get('#keybind-edit-button').click();
				cy.contains('Manual').click();

				cy.get('#spell-selector').click();
				cy.get('#Slam-option')
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
								.should('not.have.text', 'Execute');
						}
					});

				cy.get('#Slam-option').click();
				cy.contains('Cancel').click();
			}
		);

		it(
			'should have spells that are replaced by covenant spells disappear from keybindings when those talents are' +
				'selected and reappear in keybindings when the corresponding covenant is deselected',
			() => {
				cy.visit(
					'http://localhost:3000/CharacterList/-MMHC0vmSyy19FQS6JuT/%7B"characterClass":"Warrior","name":"bruce","spec":0,"race":"Tauren"%7D'
				);

				cy.get('#panel1a-header-talents').click();
				cy.get('#talent-container-Kyrian').click();

				cy.get('#keybind-edit-button').click();
				cy.contains('Manual').click();

				cy.get('#spell-selector').click();
				cy.get('#Slam-option').click();

				cy.get('#target-selector').click();
				cy.get('#Target-option').click();

				cy.get('#modifier-selector').click();
				cy.get('#None-option').click();

				cy.get('#keystroke-selector')
					.click()
					.type('d')
					.blur();
				cy.contains('Enter').click();

				cy.get('#spell-selector').click();
				cy.get('#Execute-option').click();

				cy.get('#target-selector').click();
				cy.get('#Target-option').click();

				cy.get('#modifier-selector').click();
				cy.get('#None-option').click();

				cy.get('#keystroke-selector')
					.click()
					.type('a')
					.blur();
				cy.contains('Enter').click();
				cy.contains('Apply').click();
				cy.get('#panel1a-header-keybinds').click();

				cy.get('#Slam-no-edit-display-row')
					.parent()
					.parent()
					.children()
					.its('length')
					.should('be.eq', 2);

				cy.get('#talent-container-Venthyr').click();

				cy.get('#Slam-no-edit-display-row')
					.parent()
					.parent()
					.children()
					.its('length')
					.should('be.eq', 1);

				cy.get('#talent-container-Kyrian').click();

				cy.get('#Slam-no-edit-display-row')
					.parent()
					.parent()
					.children()
					.its('length')
					.should('be.eq', 2);
			}
		);
		it(
			'should prompt for the user to confirm replacing a disabled keybinding when creating a new keybinding' +
				'that shares the disabled keybindings modifier and key',
			() => {
				cy.contains('Character Management').click();
				cy.contains('TestCharacter1').click();

				cy.get('#panel1a-header-talents').click();
				cy.get('#talent-container-Venthyr').click();

				cy.get('#keybind-edit-button').click();
				cy.contains('Manual').click();

				cy.get('#spell-selector').click();
				cy.get('#AshenHallow-option').click();

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

				cy.get('#talent-container-Kyrian').click();

				cy.get('#HolyShock-no-edit-display-row')
					.parent()
					.parent()
					.children()
					.its('length')
					.should('be.eq', 4);

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
					.type('a')
					.blur();
				cy.contains('Enter').click();
				cy.get('#warning-modal-items').should('be.visible');
				cy.get('#warning-modal-items').should(
					'have.text',
					'Currently Disabled: Ashen Hallow Self None a'
				);
				cy.contains('Confirm').click();
				cy.contains('Apply').click();

				cy.get('#talent-container-Venthyr').click();
				cy.get('#HolyShock-no-edit-display-row')
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
								.should('not.have.text', 'Ashen Hallow')
								.and('not.have.text', 'Door of Shadows');
						}
					});
			}
		);
	});
	describe('Test for PvP Talent Calculator', () => {
		it('should have active talent spells shows up in keybinding options', () => {
			cy.contains('Character Management').click();
			cy.contains('TestCharacter1').click();

			cy.get('#panel1a-header-talents').click();
			cy.get('#pvp-talent-selector-1').click();
			cy.get('#talent-container-210294').click(); //divine favor

			cy.get('#keybind-edit-button').click();
			cy.contains('Manual').click();

			cy.get('#spell-selector').click();
			cy.get('#DivineFavor-option').click();
			cy.get('#spell-selector').should('have.text', 'Divine Favor');
			cy.contains('Cancel').click();
		});

		it('should swap spells between the 3 different selectors', () => {
			cy.contains('Character Management').click();
			cy.contains('TestCharacter1').click();

			cy.get('#panel1a-header-talents').click();
			cy.get('#pvp-talent-selector-1').click();
			cy.get('#talent-container-210294').click(); //divine favor

			cy.get('#pvp-talent-selector-1').click();
			cy.get('#talent-container-210294')
				.children()
				.children()
				.eq(0)
				.should('have.css', 'filter', 'grayscale(0)');
			cy.get('#close-pvp-modal').click();

			cy.get('#pvp-talent-selector-2').click();
			cy.get('#talent-container-210294').click(); //divine favor

			cy.get('#pvp-talent-selector-1').click();
			cy.get('#talent-container-210294')
				.children()
				.children()
				.eq(0)
				.should('have.css', 'filter', 'grayscale(1)');

			cy.get('#close-pvp-modal').click();
		});
		it('should not have passive talent spells show up in keybinding options', () => {
			cy.contains('Character Management').click();
			cy.contains('TestCharacter1').click();

			cy.get('#panel1a-header-talents').click();
			cy.get('#pvp-talent-selector-1').click();
			cy.get('#talent-container-199324').click(); //divine Vision

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
							.should('not.have.text', 'Divine Vision');
					}
				});

			cy.get('#BeaconofLight-option').click();
			cy.contains('Cancel').click();
		});
		it('should disable a keybinding if it uses a spell that is deselected from the normal talent calculator and returns if its reselected', () => {
			cy.contains('Character Management').click();
			cy.contains('TestCharacter1').click();

			cy.get('#panel1a-header-talents').click();
			cy.get('#pvp-talent-selector-1').click();
			cy.get('#talent-container-210294').click(); //divine favor

			cy.get('#keybind-edit-button').click();
			cy.contains('Manual').click();

			cy.get('#spell-selector').click();
			cy.get('#DivineFavor-option').click();

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

			cy.get('#pvp-talent-selector-1').click();
			cy.get('#talent-container-199324').click(); //divine vision

			cy.get('#HolyShock-no-edit-display-row')
				.parent()
				.parent()
				.children()
				.its('length')
				.should('be.eq', 4);

			cy.get('#pvp-talent-selector-1').click();
			cy.get('#talent-container-210294').click(); //divine favor

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
				cy.visit(
					'http://localhost:3000/CharacterList/-MMHIEka5hD7hIVFlEsv/%7B"characterClass":"Shaman","name":"Bruno","spec":2,"race":"Dwarf"%7D'
				);

				cy.get('#keybind-edit-button').click();
				cy.contains('Manual').click();

				cy.get('#spell-selector').click();
				cy.get('#AstralShift-option').click();
				cy.contains('Cancel').click();

				cy.get('#panel1a-header-talents').click();
				cy.get('#pvp-talent-selector-1').click();
				cy.get('#talent-container-210918').click(); //etheral form

				cy.get('#keybind-edit-button').click();
				cy.contains('Manual').click();

				cy.get('#spell-selector').click();
				cy.get('#GhostWolf-option')
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
								.should('not.have.text', 'Astral Shift');
						}
					});

				cy.get('#GhostWolf-option').click();
				cy.contains('Cancel').click();
			}
		);

		it(
			'should have spells that are replaced by talent choices disappear from keybindings when those talents are' +
				'selected and reappear in keybindings when the corresponding talent is deselected',
			() => {
				cy.visit(
					'http://localhost:3000/CharacterList/-MMHIEka5hD7hIVFlEsv/%7B"characterClass":"Shaman","name":"Bruno","spec":2,"race":"Dwarf"%7D'
				);

				cy.get('#keybind-edit-button').click();
				cy.contains('Manual').click();

				cy.get('#spell-selector').click();
				cy.get('#GhostWolf-option').click();

				cy.get('#target-selector').click();
				cy.get('#Self-option').click();

				cy.get('#modifier-selector').click();
				cy.get('#None-option').click();

				cy.get('#keystroke-selector')
					.click()
					.type('d')
					.blur();
				cy.contains('Enter').click();

				cy.get('#spell-selector').click();
				cy.get('#AstralShift-option').click();

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

				cy.get('#GhostWolf-no-edit-display-row')
					.parent()
					.parent()
					.children()
					.its('length')
					.should('be.eq', 2);

				cy.get('#panel1a-header-talents').click();
				cy.get('#pvp-talent-selector-1').click();
				cy.get('#talent-container-210918').click(); //etheral form

				cy.get('#GhostWolf-no-edit-display-row')
					.parent()
					.parent()
					.children()
					.its('length')
					.should('be.eq', 1);

				cy.get('#pvp-talent-selector-1').click();
				cy.get('#talent-container-204261').click(); //spectral recovery

				cy.get('#GhostWolf-no-edit-display-row')
					.parent()
					.parent()
					.children()
					.its('length')
					.should('be.eq', 2);
			}
		);
		it(
			'should prompt for the user to confirm replacing a disabled keybinding when creating a new keybinding' +
				'that shares the disabled keybindings modifier and key',
			() => {
				cy.contains('Character Management').click();
				cy.contains('TestCharacter1').click();

				cy.get('#panel1a-header-talents').click();
				cy.get('#pvp-talent-selector-1').click();
				cy.get('#talent-container-210294').click(); //divine favor

				cy.get('#keybind-edit-button').click();
				cy.contains('Manual').click();

				cy.get('#spell-selector').click();
				cy.get('#DivineFavor-option').click();

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

				cy.get('#pvp-talent-selector-1').click();
				cy.get('#talent-container-199324').click(); //divine vision

				cy.get('#HolyShock-no-edit-display-row')
					.parent()
					.parent()
					.children()
					.its('length')
					.should('be.eq', 4);

				cy.get('#keybind-edit-button').click();
				cy.contains('Manual').click();

				cy.get('#spell-selector').click();
				cy.get('#BeaconofLight-option').click();

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
					'Currently Disabled: Divine Favor Self None a'
				);
				cy.contains('Confirm').click();
				cy.contains('Apply').click();

				cy.get('#pvp-talent-selector-1').click();
				cy.get('#talent-container-210294').click(); //divine favor

				cy.get('#HolyShock-no-edit-display-row')
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
								.should('not.have.text', 'Divine Favor');
						}
					});
			}
		);
	});
});
