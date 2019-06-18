import React from 'react';
import { auth } from '../../config/constants';
import { Link } from 'react-router-dom';
import '../../stylesheets/nav.css';

function NavBar() {
	const logout = e => {
		auth.signOut();
	};

	const navStyle = {
		color: 'White',
	};

	return (
		<nav className="nav-general">
			<h3>Logo</h3>
			<u1 className="nav-links">
				<Link style={navStyle} to="/Game">
					<li>GamePage</li>
				</Link>
				<Link style={navStyle} to="/">
					<li>Home</li>
				</Link>
				<button onClick={logout}>LOGOUT</button>
			</u1>
		</nav>
	);
}

export default NavBar;
