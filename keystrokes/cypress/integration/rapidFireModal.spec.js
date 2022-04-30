describe('Tests for Rapid Fire Modal', () => {
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

	it('should reflect changes in the options based on changes in the filters', () => {
		cy.visit(
			'http://localhost:3000/CharacterList/-MsCUc0LJkfB8fsPu_iV/%7B%22characterClass%22:%22Shaman%22,%22name%22:%22badoosh%22,%22spec%22:0,%22race%22:%22Dwarf%22%7D'
		);
		cy.get('#keybind-edit-button').click();
		cy.contains('Rapid Fire').click();
		cy.get('#enemytargets-checkbox').click();
		cy.get('#flameshock-checkbox')
			.parent()
			.parent()
			.should('have.css', 'color', 'rgb(255, 0, 0)');
		cy.get('#frostshock-checkbox')
			.parent()
			.parent()
			.should('have.css', 'color', 'rgb(255, 0, 0)');

		cy.get('#allytargets-button-label').click();
		cy.get('#allytargets-self-checkbox-option').click();
		cy.get('#riptide-checkbox')
			.parent()
			.parent()
			.should('have.css', 'color', 'rgb(218, 165, 32)');
		cy.get('#waterwalking-checkbox')
			.parent()
			.parent()
			.should('have.css', 'color', 'rgb(218, 165, 32)');

		cy.get('#hex-button-label').click();
		cy.get('#hex-target-checkbox-option').click();
		cy.get('#hex-checkbox')
			.parent()
			.parent()
			.should('have.css', 'color', 'rgb(218, 165, 32)');
		cy.get('#hex-checkbox').click();
		cy.get('#hex-checkbox')
			.parent()
			.parent()
			.should('have.css', 'color', 'rgb(255, 0, 0)');
		cy.get('#hex-checkbox').click();
		cy.get('#hex-checkbox')
			.parent()
			.parent()
			.should('have.css', 'color', 'rgb(0, 128, 0)');
		cy.get('#reset-config-button').click();
		cy.get('#flameshock-checkbox')
			.parent()
			.parent()
			.should('have.css', 'color', 'rgb(0, 128, 0)');
	});
	it('should have create a set of keybindings to use in a game, also basic functionality (redo, remove) should work', () => {
		const textContentVals = [
			'Earth ShieldTarget',
			'Lava BurstArena1',
			'Wind ShearArena1',
			'RiptideTarget',
			'Healing WaveTarget',
			'Astral ShiftSelf',
			'Flame ShockArena1',
			'Frost ShockArena1',
		];
		const textContentValsIncoming = [
			'Earth ShieldTargetShift5 ',
			'Lava BurstArena1Nonef ',
			'Wind ShearArena1Noneo ',
			'RiptideTargetNonej ',
			'Healing WaveTargetShift4 ',
			'Astral ShiftSelfNoned ',
			'Flame ShockArena1Noner ',
		];
		const correctBindsForSpells = {
			'Earth Shield': 'Shift 5',
			'Lava Burst': 'None f',
			'Wind Shear': 'None o',
			Riptide: 'None j',
			'Healing Wave': 'Shift 4',
			'Astral Shift': 'None d',
			'Flame Shock': 'None r',
		};
		cy.visit(
			'http://localhost:3000/CharacterList/-MsCUc0LJkfB8fsPu_iV/%7B%22characterClass%22:%22Shaman%22,%22name%22:%22badoosh%22,%22spec%22:0,%22race%22:%22Dwarf%22%7D'
		);
		cy.get('#keybind-edit-button').click();
		cy.contains('Rapid Fire').click();
		//set up spells
		cy.get('#enemytargets-checkbox').click();
		cy.get('#allytargets-checkbox').click();
		cy.get('#enemytarget-checkbox').click();
		cy.get('#allytarget-checkbox').click();
		cy.get('#placed-checkbox').click();
		cy.get('#self-checkbox').click();
		cy.get('#flameshock-button-label').click();
		cy.get('#flameshock-arena1-checkbox-option').click();
		cy.get('#preset-config-label').click({ force: true });
		cy.get('#frostshock-button-label').click();
		cy.get('#frostshock-arena1-checkbox-option').click();
		cy.get('#preset-config-label').click({ force: true });
		cy.get('#riptide-button-label').click();
		cy.get('#riptide-target-checkbox-option').click();
		cy.get('#preset-config-label').click({ force: true });
		cy.get('#lavaburst-button-label').click();
		cy.get('#lavaburst-arena1-checkbox-option').click();
		cy.get('#preset-config-label').click({ force: true });
		cy.get('#windshear-button-label').click();
		cy.get('#windshear-arena1-checkbox-option').click();
		cy.get('#preset-config-label').click({ force: true });
		cy.get('#earthshield-button-label').click();
		cy.get('#earthshield-target-checkbox-option').click();
		cy.get('#preset-config-label').click({ force: true });
		cy.get('#healingwave-button-label').click();
		cy.get('#healingwave-target-checkbox-option').click();
		cy.get('#preset-config-label').click({ force: true });
		cy.get('#astralshift-button-label').click();
		cy.get('#astralshift-self-checkbox-option').click();
		cy.get('#preset-config-label').click({ force: true });

		cy.contains('Start Rapid Fire').click();
		cy.get('#keybind-row-container-body')
			.children()
			.should('have.length', 8)
			.each((item, index) => {
				expect(item.text()).to.eq(textContentVals[index]);
			});
		cy.get('#keybind-prompt')
			.type('{shift}5')
			.contains('Shift 5Press again to confirm.');

		cy.get('#keybind-prompt').type('{shift}5');
		cy.get('[aria-selected=false]').contains('Outgoing Spell Changes');
		cy.get('[aria-selected=true]').contains('Incoming Spell Changes');
		cy.get('#keybind-row-container-body')
			.children()
			.should('have.length', 1)
			.each((item, index) => {
				expect(item.text()).to.eq(textContentValsIncoming[index]);
			});
		cy.get('[aria-selected=false]')
			.contains('Outgoing Spell Changes')
			.click();
		cy.get('#keybind-row-container-body')
			.children()
			.should('have.length', 7)
			.each((item, index) => {
				expect(item.text()).to.eq(textContentVals[index + 1]);
			});
		cy.get('#keybind-prompt')
			.type('f')
			.type('f');
		cy.get('#keybind-prompt')
			.type('o')
			.type('o');
		cy.get('#keybind-prompt')
			.type('j')
			.type('j');
		cy.get('#keybind-prompt')
			.type('{shift}4')
			.type('{shift}4');
		cy.get('#keybind-prompt')
			.type('d')
			.type('d');
		cy.get('#keybind-row-container-body')
			.children()
			.eq(1)
			.find('#FrostShockArena1-delete')
			.click();

		cy.get('#keybind-row-container-body')
			.children()
			.should('have.length', 1)
			.each((item, index) => {
				expect(item.text()).to.eq('Flame ShockArena1');
			});

		cy.get('[aria-selected=false]')
			.contains('Incoming Spell Changes')
			.click();
		cy.get('#keybind-row-container-body')
			.children()
			.should('have.length', 6)
			.each((item, index) => {
				expect(item.text()).to.eq(textContentValsIncoming[index]);
			});
		cy.get('#EarthShieldTarget-refresh').click({ force: true });
		cy.get('#keybind-row-container-body')
			.children()
			.should('have.length', 5);
		cy.get('[aria-selected=false]')
			.contains('Outgoing Spell Changes')
			.click();
		cy.get('#keybind-row-container-body')
			.children()
			.should('have.length', 2)
			.eq(1)
			.then(ele => {
				expect(ele.text()).to.eq('Earth ShieldTarget');
			});

		cy.get('#keybind-prompt')
			.type('r')
			.type('r');
		cy.get('#keybind-prompt')
			.type('{shift}5')
			.type('{shift}5');
		cy.get('[aria-selected=true]').contains('Incoming Spell Changes');

		cy.get('[aria-selected=false]')
			.contains('Outgoing Spell Changes')
			.should('not.exist');
		//confirm their locations in the list (do some fancy shit to make it swap first for last using mod probably)
		cy.get('#keybind-row-container-body')
			.children()
			.should('have.length', 7)
			.each((item, index) => {
				expect(item.text()).to.eq(
					//using (index+1)%7 allows us to move the first value to the end in the list
					textContentValsIncoming[(index + 1) % 7]
				);
			});
		cy.get('#EarthShieldTarget-refresh').click({ force: true });
		cy.get('[aria-selected=false]')
			.contains('Outgoing Spell Changes')
			.click();
		cy.get('#keybind-row-container-body')
			.children()
			.should('have.length', 1)
			.contains('Earth ShieldTarget');
		cy.get('#keybind-prompt')
			.type('{shift}5')
			.type('{shift}5');
		cy.get('[aria-selected=false]')
			.contains('Outgoing Spell Changes')
			.should('not.exist');
		cy.contains('Finish').click();
		cy.get('#panel1a-header-keybinds').click();
		cy.get('#keybind-row-container').each((item, index) => {
			expect(item.text()).to.eq(
				//using (index+1)%7 allows us to move the first value to the end in the list
				textContentValsIncoming[(index + 1) % 7].trim()
			);
		});
		//Contains didnt work here with save, really weird. happened before aswell
		cy.get('#save-character-changes').click();
		cy.get('#select-character').click();
		cy.contains('Character Management').click();
		cy.contains('badoosh')
			.parent()
			.parent()
			.parent()
			.should('have.css', 'background-color')
			.and('eq', 'rgb(255, 255, 0)');
		cy.contains('GamePage').click();
		for (let i = 0; i < 4; i++) {
			cy.get('#keybind-prompt').type('{alt}b'); //just has to be a keybinding that doesnt exist
			cy.get('.App-header')
				.eq(0)
				.then(ele => {
					const name = ele.text();
					cy.get('#failed-prompt').then(obj => {
						const correctBinding = obj.text();
						const keybindString = correctBinding.replace(
							/correct keybinding: /,
							''
						);
						expect(correctBindsForSpells[name]).to.eq(
							keybindString[0] === ' '
								? 'None' + keybindString
								: keybindString
						);
						const keybind = keybindString.split(' ');
						cy.get('#keybind-prompt').type(
							`{${keybind[0] === 'None' ? '' : keybind[0]}}${
								keybind[1]
							}`
						);
					});
				});
		}
	});
	it('should give a warning and remove old binding if new bind is overwriting it', () => {
		cy.contains('Character Management').click();
		cy.contains('TestCharacter1').click();

		cy.get('#keybind-edit-button').click();
		cy.contains('Rapid Fire').click();

		createBase();
		cy.contains('Start Rapid Fire').click();
		cy.get('#keybind-prompt')
			.type('j')
			.contains('Already exists for Holy Shock on Target, overwriting')
			.type('j');
		cy.get('#keybind-row-container-body')
			.children()
			.eq(0)
			.contains('Holy ShockTarget');
		cy.get('[aria-selected=false]')
			.contains('Incoming Spell Changes')
			.click();
		cy.get('#keybind-row-container-body')
			.children()
			.each(el => {
				cy.wrap(el).should('not.contain', 'Holy Shock');
			});
		cy.get('#close-rapid-fire').click();
	});

	it('should give a warning and remove old spell/target if new spell/target is overwriting it  and it does exist in the queue', () => {
		cy.contains('Character Management').click();
		cy.contains('TestCharacter1').click();

		cy.get('#keybind-edit-button').click();
		cy.contains('Rapid Fire').click();

		createBase();
		cy.contains('Start Rapid Fire').click();
		cy.get('#keybind-prompt')
			.type('h')
			.type('h');
		cy.get('#keybind-prompt')
			.type('o')
			.contains('Already exists for Holy Shock on Target, overwriting')
			.type('o');
		cy.get('#keybind-row-container-body')
			.children()
			.last()
			.contains('Holy ShockTarget');
		cy.get('[aria-selected=false]')
			.contains('Outgoing Spell Changes')
			.should('not.exist');
		cy.get('#close-rapid-fire').click();
	});

	it('should give a warning and add back in old spell/target if new spell/target is overwriting it and it doesnt exist in the queue', () => {
		cy.contains('Character Management').click();
		cy.contains('TestCharacter1').click();

		cy.get('#keybind-edit-button').click();
		cy.contains('Rapid Fire').click();

		createBase(false);
		cy.contains('Start Rapid Fire').click();
		cy.get('#keybind-prompt')
			.type('j')
			.contains('Already exists for Holy Shock on Target, overwriting')
			.type('j');
		cy.get('#keybind-row-container-body')
			.children()
			.last()
			.contains('Holy ShockTarget');
		cy.get('[aria-selected=true]').contains('Outgoing Spell Changes');
		cy.get('#close-rapid-fire').click();
	});

	function createBase(set = true) {
		cy.get('#assistally-checkbox').click();
		cy.get('#anytarget-checkbox').click();
		cy.get('#enemytarget-checkbox').click();
		cy.get('#allytarget-checkbox').click();
		cy.get('#self-checkbox').click();
		if (set) {
			cy.get('#holyshock-button-label').click();
			cy.get('#holyshock-target-checkbox-option').click();
			cy.get('#preset-config-label').click({ force: true });
		}
		cy.get('#judgment-button-label').click();
		cy.get('#judgment-target-checkbox-option').click();
		cy.get('#preset-config-label').click({ force: true });
	}
});
