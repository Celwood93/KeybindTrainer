import React from 'react';
import PropTypes from 'prop-types';
import { auth, googleProvider, emailProvider } from '../config/constants';
import { FirebaseAuth } from 'react-firebaseui';

const propTypes = {
	signInSuccess: PropTypes.func,
	loginText: PropTypes.string,
};

const defaultProps = {
	signInSuccess: () => {},
	loginText: 'Login',
};

class Auth extends React.Component {
	constructor(props) {
		super(props);

		this.uiConfig = {
			signInOptions: [
				googleProvider,
				emailProvider,
			]
		};

		this.state = {
			signedIn: false,
		};
	}

	render() {
		return (
			<div className="card">
				<div className="card-content">
					<p className="title has-text-centered">{this.props.loginText}</p>
					<FirebaseAuth uiConfig={this.uiConfig} firebaseAuth={auth}/>
				</div>
			</div>
		);
	}
}

Auth.propTypes = propTypes;
Auth.defaultProps = defaultProps;

export default Auth;