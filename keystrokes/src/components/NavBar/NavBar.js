import React from 'react';
import { auth } from '../../config/constants';
import { Link } from 'react-router-dom';
import '../../stylesheets/nav.css';
import UnsavedCharacterModal from '../utils/UnsavedCharacterModal';

function NavBar({ userId }) {
	const logout = _ => {
		auth.signOut();
	};

	const navStyle = {
		color: 'White',
	};

	return (
		<nav className="nav-general">
			<UnsavedCharacterModal userId={userId} />
			<h3>Logo</h3>
			<div className="nav-links">
				<Link style={navStyle} to="/Game">
					<li>GamePage</li>
				</Link>
				<Link style={navStyle} to="/CharacterList">
					<li>Character Management</li>
				</Link>
				<Link style={navStyle} to="/">
					<li>Home</li>
				</Link>
				<button onClick={logout}>LOGOUT</button>
			</div>
		</nav>
	);
}

export default NavBar;
