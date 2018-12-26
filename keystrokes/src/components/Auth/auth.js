import React from 'react';
import { auth } from '../../config/constants';
import Home from './home';
import Login from './login';

class Auth extends React.Component {
	constructor(props) {
		super(props);
		this.authListener = this.authListener.bind(this);

		this.state = {
			user: null,
		};
	}

	async componentDidMount() {
		await this.authListener();
	}

	componentWillUnMount() {
		this.authListener.off();
	}

	async authListener() {
		console.log(this.state.user);
		auth.onAuthStateChanged(user => {
			console.log(user);
			if (user) {
				this.setState({ user });
			} else {
				this.setState({ user: null });
			}
		});
	}

	render() {
		return (
			<div className="card">{this.state.user ? <Home /> : <Login />}</div>
		);
	}
}

export default Auth;
