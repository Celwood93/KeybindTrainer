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
								.map(e => ({ ...allSpells[e.SpellId], ...e }))
								.map(row => (
									<TableRow
										key={row.spellName + row.Target}
										id="keybind-row-container"
									>
										<TableCell component="th" scope="row">
											{row.spellName}
										</TableCell>
										<TableCell align="right">
											{row.Target}
										</TableCell>
										<TableCell align="right">
											{row.Mod}
										</TableCell>
										<TableCell align="right">
											{row.Key}
										</TableCell>
										<TableCell align="right">
											{editing && (
												<div>
													<IconButton
														disabled={
															editingKey &&
															editingKey !==
																row.spellName +
																	row.Target
														}
														onClick={() => {
															editThisRow(row);
														}}
														hoverstyle={{
															cursor: 'pointer',
														}}
													>
														{editingKey !==
														row.spellName +
															row.Target ? (
															<EditIcon
																id={`${row.spellName.replace(
																	/ /g,
																	''
																) +
																	row.Target}-edit`}
															/>
														) : (
															<CancelOutlined
																id={`${row.spellName.replace(
																	/ /g,
																	''
																) +
																	row.Target}-cancel`}
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
															id={`${row.spellName.replace(
																/ /g,
																''
															) +
																row.Target}-delete`}
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
