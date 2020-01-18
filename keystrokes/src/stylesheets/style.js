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
	characterList: {
		paddingLeft: '25%',
		paddingRight: '25%',
		width: '50%',
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
