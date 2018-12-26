import React, { Component } from 'react';
import { auth } from '../../config/constants';

class Home extends Component {
	logout = e => {
		auth.signOut();
	};

	render() {
		return (
			<div className="card">
				<div className="card-content">
					<p className="title has-text-centered">Home Page</p>
					<button onClick={this.logout}>LOGOUT</button>
				</div>
			</div>
		);
	}
}

export default Home;
