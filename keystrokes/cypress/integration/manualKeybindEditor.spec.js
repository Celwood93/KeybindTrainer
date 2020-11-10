import { characterDetails } from '../../src/config/constants';
describe('Tests for Manual Keybind Editor', () => {
	it('authenticates', () => {
		cy.logout();
		cy.visit('/');
		cy.login('ILHEEvO7wmWa0r7xtHqMmmQ3vxe2'); //might want to put this somewhere else
		cy.contains('LandingPage');
	});
	before(() => {
		cy.resetDB();
	});

	describe('it should be able to change/remove keybindings correctly', () => {
		it('should be able to update an item and successfully save it', () => {
			cy.contains('Character Management').click();
			cy.contains('TestCharacter1').click();
			cy.get('#keybind-edit-button').click();
			cy.contains('Manual').click();
			cy.get('#HolyShockTarget-edit').click();

			cy.get('#HolyShockTarget-cancel').should('be.visible');

			cy.get('#HammerofJusticeArena3-edit')
				.parent()
				.parent()
				.should('have.class', 'Mui-disabled');

			cy.get('#modifier-selector').click();
			cy.get('#Shift-option').click();

			cy.get('#keystroke-selector')
				.click()
				.type('k')
				.blur();
			cy.contains('Enter').click();
			cy.get('#HolyShockTarget-edit')
				.parent()
				.parent()
				.parent()
				.parent()
				.parent()
				.children()
				.within(ele => {
					cy.wrap(ele)
						.eq(0)
						.should('have.text', 'Holy Shock');
					cy.wrap(ele)
						.eq(1)
						.should('have.text', 'Target');

					cy.wrap(ele)
						.eq(2)
						.should('have.text', 'Shift');

					cy.wrap(ele)
						.eq(3)
						.should('have.text', 'k');
				});
			cy.contains('Apply').click();
			cy.contains('Holy Shock')
				.parent()
				.children()
				.within(ele => {
					cy.wrap(ele)
						.eq(0)
						.should('have.text', 'Holy Shock');
					cy.wrap(ele)
						.eq(1)
						.should('have.text', 'Target');

					cy.wrap(ele)
						.eq(2)
						.should('have.text', 'Shift');

					cy.wrap(ele)
						.eq(3)
						.should('have.text', 'k');
				});
			cy.contains('SAVE').click();
			cy.reload();

			cy.contains('Holy Shock')
				.parent()
				.children()
				.within(ele => {
					cy.wrap(ele)
						.eq(0)
						.should('have.text', 'Holy Shock');
					cy.wrap(ele)
						.eq(1)
						.should('have.text', 'Target');

					cy.wrap(ele)
						.eq(2)
						.should('have.text', 'Shift');

					cy.wrap(ele)
						.eq(3)
						.should('have.text', 'k');
				});

			cy.resetDB();
		});
		it('should be able to delete an item and successfully save it', () => {
			const names = [
				'Hammer of JusticeArena3Ctrlr',
				'Hammer of JusticeArena2Shiftr',
				'Hammer of JusticeArena1Noner',
			];
			cy.contains('Character Management').click();
			cy.contains('TestCharacter1').click();
			cy.get('#keybind-edit-button').click();
			cy.contains('Manual').click();
			cy.get('#HolyShockTarget-delete').click();
			cy.get('#HammerofJusticeArena3-edit')
				.parent()
				.parent()
				.parent()
				.parent()
				.parent()
				.parent()
				.children()
				.its('length')
				.should('eq', 3);
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
			cy.contains('Apply').click();
			cy.contains('Hammer of Justice')
				.parent()
				.parent()
				.children()
				.its('length')
				.should('eq', 3);
			cy.contains('Hammer of Justice')
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

			cy.contains('SAVE').click();
			cy.reload();

			cy.contains('Hammer of Justice')
				.parent()
				.parent()
				.children()
				.its('length')
				.should('eq', 3);
			cy.contains('Hammer of Justice')
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

			cy.resetDB();
		});
	});

	describe('it should have keybindings be consistent between keybind profiles and specs', () => {
		it('should be able to add keybinds at the same time accross multiple keybind profiles and specs', () => {
			cy.contains('Character Management').click();
			cy.contains('TestCharacter1').click();
			let specIndex;
			let keybindIndex;
			let keybindAttIndex;
			const keybindings = {
				HOLY: [
					['Light of the Martyr', 'Target', 'None', 'o'],
					['Beacon of Light', 'Focus', 'Shift', '1'],
				],
				PROTECTION: [
					['Blessing of Protection', 'Party1', 'Shift', 'h'],
					['Blessing of Freedom', 'Party2', 'Ctrl', 'c'],
				],
				RETRIBUTION: [
					['Blessing of Sacrifice', 'Party1', 'Alt', 's'],
					['Judgment', 'Arena1', 'None', 'y'],
				],
			};
			const values = [
				'spell-selector',
				'target-selector',
				'modifier-selector',
			];
			for (
				specIndex = 0;
				specIndex < characterDetails.class['Paladin'].length;
				specIndex++
			) {
				cy.contains(
					characterDetails.class['Paladin'][specIndex]
				).click();
				for (keybindIndex = 0; keybindIndex < 2; keybindIndex++) {
					cy.get('#keybind-edit-button').click();
					cy.contains('Manual').click();
					for (
						keybindAttIndex = 0;
						keybindAttIndex < 3;
						keybindAttIndex++
					) {
						cy.get(`#${values[keybindAttIndex]}`).click();
						cy.get(
							`#${keybindings[
								characterDetails.class['Paladin'][specIndex]
							][keybindIndex][keybindAttIndex].replace(
								/ /g,
								''
							)}-option`
						).click();
						cy.get(`#${values[keybindAttIndex]}`).should(
							'have.text',
							`${
								keybindings[
									characterDetails.class['Paladin'][specIndex]
								][keybindIndex][keybindAttIndex]
							}`
						);
					}

					cy.get('#keystroke-selector')
						.click()
						.type(
							`${
								keybindings[
									characterDetails.class['Paladin'][specIndex]
								][keybindIndex][3]
							}`
						)
						.blur();
					cy.get('#keystroke-selector').should(
						'have.value',
						`${
							keybindings[
								characterDetails.class['Paladin'][specIndex]
							][keybindIndex][3]
						}`
					);

					cy.contains('Enter').click();
					cy.contains('Apply').click();

					if (keybindIndex < 1) {
						cy.contains('Create New Keybindings').click();
					}
				}
			}
			for (
				specIndex = 0;
				specIndex < characterDetails.class['Paladin'].length;
				specIndex++
			) {
				cy.contains(
					characterDetails.class['Paladin'][specIndex]
				).click();
				for (keybindIndex = 0; keybindIndex < 2; keybindIndex++) {
					cy.contains(`Keybindings-${keybindIndex + 1}`).click();
					cy.get('#panel1a-header-keybinds').click();
					for (
						keybindAttIndex = 0;
						keybindAttIndex < 4;
						keybindAttIndex++
					) {
						cy.contains(
							`${
								keybindings[
									characterDetails.class['Paladin'][specIndex]
								][keybindIndex][keybindAttIndex]
							}`
						);
					}
				}
			}
		});
	});
});
