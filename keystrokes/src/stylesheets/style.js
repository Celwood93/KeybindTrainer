import { makeStyles } from '@material-ui/core/styles';
import { green, pink } from '@material-ui/core/colors';

const styleGuide = makeStyles(theme => ({
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	detailedDropdownConfig: {
		position: 'absolute',
		top: 28,
		right: 0,
		left: 0,
		zIndex: 1,
		border: '1px solid',
		padding: theme.spacing(1),
		backgroundColor: theme.palette.background.paper,
		width: '80px',
	},
	pvpTalentModal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	keybindsComplete: {
		color: theme.palette.getContrastText(green[500]),
		backgroundColor: green[500],
		width: theme.spacing(3),
		height: theme.spacing(3),
	},
	keybindsIncomplete: {
		color: theme.palette.getContrastText(pink[500]),
		backgroundColor: pink[500],
		width: theme.spacing(3),
		height: theme.spacing(3),
	},
	keybindsTargetComplete: {
		color: theme.palette.getContrastText(green[500]),
		backgroundColor: green[500],
		width: theme.spacing(2),
		height: theme.spacing(2),
	},
	keybindsTargetIncomplete: {
		color: theme.palette.getContrastText(pink[500]),
		backgroundColor: pink[500],
		width: theme.spacing(2),
		height: theme.spacing(2),
	},
	paper: {
		paddingTop: '5rem',
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
	table: {
		marginTop: '3rem',
		minWidth: '60%',
	},
	tableContainer: {
		maxHeight: '38rem',
	},
	tableContainerRF: {
		maxHeight: '280px',
		width: 'fit-content',
	},
	manualModalBackground: {
		width: '70%',
		height: '80%',
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},

	rapidFireModalBackground: {
		width: '70%',
		height: '80%',
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
	unsavedCharacterModalBackground: {
		width: '30%',
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
	pvpTalentModalBackground: {
		width: '200px',
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
	keybindingConflictModal: {
		width: '35%',
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
	paddingTop: {
		paddingTop: '3rem',
	},
	tabRoot: {
		flexGrow: 1,
		width: '80%',
		backgroundColor: theme.palette.background.paper,
	},
	keybindingOptions: {
		paddingLeft: '0.5rem',
		paddingRight: '0.5rem',
	},
	tabPageContainer: {
		paddingLeft: '2rem',
		paddingRight: '2rem',
	},
	paddingTwoRem: {
		padding: '2rem',
	},
	detailPageContainer: {
		marginLeft: '1rem',
		marginRight: '1rem',
	},
	bottomMarginNegTwo: {
		marginBottom: '-2rem',
	},
	marginLeftTwoRem: {
		marginLeft: '2rem',
	},
	characterList: {
		display: 'flex',
		justifyContent: 'center',
	},
	characterListItem: {
		backgroundColor: 'lightblue',
		marginBottom: '1rem',
	},
	characterListItemSelected: {
		backgroundColor: 'yellow',
		marginBottom: '1rem',
	},
	charListItem: {
		justifyContent: 'center',
		width: '15rem',
	},
	newCharacterListItem: {
		backgroundColor: 'lightgreen',
	},
	newCharListItem: {
		justifyContent: 'center',
		width: '15rem',
	},
	button: {
		width: '10rem',
	},
}));

export default styleGuide;
