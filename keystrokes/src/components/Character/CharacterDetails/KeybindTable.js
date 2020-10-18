import React, { useState } from 'react';
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

KeybindTable.propTypes = {
	allKeybinds: PropTypes.array.isRequired,
	editing: PropTypes.bool.isRequired,
	editKeybind: PropTypes.func,
	editThisRow: PropTypes.func,
	editingKey: PropTypes.any,
};

function KeybindTable({ allKeybinds, editing, editThisRow, editingKey }) {
	const classes = styleGuide();
	return (
		<Grid item>
			<TableContainer component={Paper}>
				<Table
					className={classes.table}
					size="small"
					aria-label="a dense table"
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
						{allKeybinds.map(row => (
							<TableRow
								key={row.Spell + row.Target}
								id="keybind-row-container"
							>
								<TableCell component="th" scope="row">
									{row.Spell}
								</TableCell>
								<TableCell align="right">
									{row.Target}
								</TableCell>
								<TableCell align="right">{row.Mod}</TableCell>
								<TableCell align="right">{row.Key}</TableCell>
								<TableCell align="right">
									{editing && (
										<IconButton
											disabled={
												editingKey &&
												editingKey !==
													row.Spell + row.Target
											}
											onClick={() => {
												editThisRow(row);
											}}
											hoverstyle={{ cursor: 'pointer' }}
										>
											{editingKey !==
											row.Spell + row.Target ? (
												<EditIcon />
											) : (
												<CancelOutlined />
											)}
										</IconButton>
									)}
									<IconButton
										onClick={() => {
											console.log('is it working?');
										}}
										hoverstyle={{ cursor: 'pointer' }}
									>
										<DeleteIcon />
									</IconButton>
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
