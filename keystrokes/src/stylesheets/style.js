import { makeStyles } from '@material-ui/core/styles';

const styleGuide = makeStyles(theme => ({
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	paper: {
		width: '50%',
		paddingTop: '5rem',
		height: '20%',
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
	manualModalBackground: {
		width: '70%',
		height: '80%',
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
