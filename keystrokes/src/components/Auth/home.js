import React, { Component } from 'react';
import { FirebaseAuth } from 'react-firebaseui';
import { auth, googleProvider, emailProvider } from '../../config/constants';


class Home extends Component {
    constructor(props) {
        super(props);

        this.uiConfig = {
            blah: {}
		};

    }

    logout = (e) => {
        auth.signOut();
    }

    render() {
        return (
			<div className="card">
				<div className="card-content">
					<p className="title has-text-centered">{this.props.homeText}</p>
					<button onClick={this.logout}>LOGOUT</button>
				</div>
			</div>
        )
    }
}

export default Home;