import React from 'react';
import { auth } from '../../config/constants';
import Home from '../Home/Home';
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
			<div className="card">
				{this.state.user ? <Home user={this.state.user} /> : <Login />}
			</div>
		);
	}
}

export default Auth;
