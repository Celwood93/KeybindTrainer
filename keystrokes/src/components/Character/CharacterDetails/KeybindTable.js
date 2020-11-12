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
import EditIcon from '@material-ui/icons/Edit';
import { removeWaterMark } from '../../utils/toolTipHooks';
import CancelOutlined from '@material-ui/icons/CancelOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import { AllSpellsContext } from '../../../contexts/AllSpellsContext';

KeybindTable.propTypes = {
	allKeybinds: PropTypes.array.isRequired,
	deleteThisRow: PropTypes.func,
	editing: PropTypes.bool,
	editThisRow: PropTypes.func,
	editingKey: PropTypes.any,
};

function KeybindTable({
	allKeybinds,
	editing = false,
	editThisRow,
	deleteThisRow,
	editingKey,
}) {
	const allSpells = useContext(AllSpellsContext);
	const classes = styleGuide();
	removeWaterMark('#keybind-row-container a');
	return (
		<Grid item>
			<TableContainer
				className={classes.tableContainer}
				component={Paper}
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
							<TableCell align="right">Modifier</TableCell>
							<TableCell align="right">Key</TableCell>
							<TableCell align="right"></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{allKeybinds &&
							allKeybinds
								.filter(e => !e.disabled)
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
														maxHeight: editing
															? '36px'
															: '24px',
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
										<TableCell align="right">
											{row.mod}
										</TableCell>
										<TableCell align="right">
											{row.key}
										</TableCell>
										<TableCell align="right">
											{editing && (
												<div>
													<IconButton
														disabled={
															editingKey &&
															editingKey !==
																row.spellId +
																	row.target
														}
														onClick={() => {
															editThisRow(row);
														}}
														hoverstyle={{
															cursor: 'pointer',
														}}
													>
														{editingKey !==
														row.spellId +
															row.target ? (
															<EditIcon
																id={`${allSpells[
																	row.spellId
																].spellName.replace(
																	/ |:|'/g,
																	''
																) +
																	row.target}-edit`}
															/>
														) : (
															<CancelOutlined
																id={`${allSpells[
																	row.spellId
																].spellName.replace(
																	/ |:|'/g,
																	''
																) +
																	row.target}-cancel`}
															/>
														)}
													</IconButton>
													<IconButton
														onClick={() => {
															deleteThisRow(row);
														}}
														hoverstyle={{
															cursor: 'pointer',
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

export default KeybindTable;
