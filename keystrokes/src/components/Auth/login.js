import React, { Component } from 'react';
import { FirebaseAuth } from 'react-firebaseui';
import { auth, googleProvider, emailProvider } from '../../config/constants';

class Login extends Component {
	constructor(props) {
		super(props);

		this.uiConfig = {
			signInOptions: [googleProvider, emailProvider],
		};
	}

	render() {
		return (
			<div>
				<div>
					<p className="title has-text-centered">Login Page!</p>
					<FirebaseAuth
						uiConfig={this.uiConfig}
						firebaseAuth={auth}
					/>
				</div>
			</div>
		);
	}
}

export default Login;
