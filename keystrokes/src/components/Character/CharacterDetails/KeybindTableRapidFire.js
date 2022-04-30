import React, { useContext } from 'react';
import {
	Grid,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import styleGuide from '../../../stylesheets/style';
import { removeWaterMark } from '../../utils/toolTipHooks';
import RefreshIcon from '@material-ui/icons/Refresh';
import DeleteIcon from '@material-ui/icons/Delete';
import { AllSpellsContext } from '../../../contexts/AllSpellsContext';

KeybindTableRapidFire.propTypes = {
	allKeybinds: PropTypes.array,
	deleteThisRow: PropTypes.func,
	editing: PropTypes.bool,
	editThisRow: PropTypes.func,
	editingKey: PropTypes.any,
	finishedState: PropTypes.bool,
};

function KeybindTableRapidFire({
	allKeybinds,
	editing = false,
	editThisRow,
	deleteThisRow,
	editingKey,
	finishedState = false,
}) {
	const allSpells = useContext(AllSpellsContext);
	const classes = styleGuide();
	removeWaterMark('#keybind-row-container-rf a', []);
	return (
		<Grid item style={{ marginTop: '12px', width: '100%' }}>
			<TableContainer
				component={Paper}
				style={{ maxHeight: !finishedState ? '230px' : '620px' }}
			>
				<Table
					stickyHeader
					className={classes.table}
					size="small"
					aria-label="sticky table"
				>
					<TableHead>
						<TableRow>
							<TableCell align="left">Icon</TableCell>
							<TableCell>Spell</TableCell>
							<TableCell align="right">Target</TableCell>
							{!deleteThisRow && (
								<TableCell align="right">Modifier</TableCell>
							)}
							{!deleteThisRow && (
								<TableCell align="right">Key</TableCell>
							)}
							<TableCell align="right"></TableCell>
						</TableRow>
					</TableHead>
					<TableBody id="keybind-row-container-body">
						{allKeybinds &&
							allKeybinds
								.filter(bind => !bind.disabled)
								.map(row => (
									<TableRow
										key={row.spellId + row.target}
										id="keybind-row-container"
									>
										<TableCell>
											<a
												data-wowhead={`https://www.wowhead.com/spell=${row.spellId}`}
												style={{ cursor: 'default' }}
											>
												<img
													src={`https://wow.zamimg.com/images/wow/icons/medium/${
														allSpells[row.spellId]
															.iconId
													}.jpg`}
													alt=""
													style={{
														maxHeight: '24px',
													}}
												/>
											</a>
										</TableCell>
										<TableCell
											component="th"
											scope="row"
											id={`${allSpells[
												row.spellId
											].spellName.replace(
												/ |:|'/g,
												''
											)}-${
												editing ? 'edit' : 'no-edit'
											}-display-row`}
										>
											{allSpells[row.spellId].spellName}
										</TableCell>
										<TableCell align="right">
											{row.target}
										</TableCell>
										{row.mod && (
											<TableCell align="right">
												{row.mod}
											</TableCell>
										)}
										{row.key && (
											<TableCell align="right">
												{row.key}
											</TableCell>
										)}
										<TableCell align="right">
											{editing && (
												<div>
													{editThisRow && (
														<IconButton
															onClick={() => {
																editThisRow(
																	row
																);
															}}
															style={{
																maxHeight:
																	'24px',
															}}
															hoverstyle={{
																cursor:
																	'pointer',
															}}
														>
															<RefreshIcon
																id={`${allSpells[
																	row.spellId
																].spellName.replace(
																	/ |:|'/g,
																	''
																) +
																	row.target}-refresh`}
															/>{' '}
														</IconButton>
													)}
													{deleteThisRow && (
														<IconButton
															onClick={() => {
																deleteThisRow(
																	row
																);
															}}
															hoverstyle={{
																cursor:
																	'pointer',
															}}
															style={{
																maxHeight:
																	'24px',
															}}
														>
															<DeleteIcon
																id={`${allSpells[
																	row.spellId
																].spellName.replace(
																	/ |:|'/g,
																	''
																) +
																	row.target}-delete`}
															/>
														</IconButton>
													)}
												</div>
											)}
										</TableCell>
									</TableRow>
								))}
					</TableBody>
				</Table>
			</TableContainer>
		</Grid>
	);
}

export default KeybindTableRapidFire;
