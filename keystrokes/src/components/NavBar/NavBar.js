import React from 'react';
import { auth } from '../../config/constants';
import { Link } from 'react-router-dom';
import '../../stylesheets/App.css';

function NavBar() {
	const logout = e => {
		auth.signOut();
	};
	return (
		<nav>
			<h3>Logo</h3>
			<u1 className="nav-links">
				<Link to="/Game">
					<li>GamePage</li>
				</Link>
				<Link to="/">
					<li>Home</li>
				</Link>
				<button onClick={logout}>LOGOUT</button>
			</u1>
		</nav>
	);
}

export default NavBar;
