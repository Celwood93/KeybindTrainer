import React, { useEffect, useState } from 'react';
import { auth } from '../../config/constants';
import Home from '../Home/Home';
import Login from './login';

function Auth() {
	const [user, setUser] = useState();

	useEffect(() => {
		const unsubscribe = onAuthStateChange();
		return unsubscribe;
	}, []);

	function onAuthStateChange() {
		auth.onAuthStateChanged(user => {
			if (user) {
				setUser(user);
			} else {
				setUser(null);
			}
		});
	}

	return (
		<div className="card">{user ? <Home user={user} /> : <Login />}</div>
	);
}

export default Auth;
