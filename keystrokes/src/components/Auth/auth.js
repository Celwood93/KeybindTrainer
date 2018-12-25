import React from 'react';
import PropTypes from 'prop-types';
import { auth } from '../../config/constants';
import Home from './home';
import Login from './login';

const propTypes = {
	signInSuccess: PropTypes.func,
	loginText: PropTypes.string,
};

const defaultProps = {
	signInSuccess: () => {},
	loginText: 'Login',
	homeText: 'PLACEHOLDER HOME PAGE'
};

class Auth extends React.Component {
	constructor(props) {
		super(props);
		this.authListener = this.authListener.bind(this);

		this.state = {
			user: {},
		};
	}

	async componentDidMount() {
		await this.authListener();
	}

	componentWillUnMount() {
		this.authListener.off();
	}

	async authListener(){
		console.log(this.state.user);
		auth.onAuthStateChanged((user) => {
			console.log(user);
			if (user) {
				this.setState({user});
			} else {
				this.setState({user: null});
			}

		});
	}



	render() {
		return (
			<div className="card">
				{ this.state.user ? (<Home />) : (<Login />) }
			</div>
		);
	}
}

Auth.propTypes = propTypes;
Auth.defaultProps = defaultProps;

export default Auth;