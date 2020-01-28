import React, { useEffect, useState } from 'react';
import { auth } from '../../config/constants';
import Home from '../Home/Home';
import Login from './login';

function Auth() {
	const [user, setUser] = useState();

	useEffect(() => {
		setUser({ email: 'celwood93@gmail.com' }); //added for work offline
		//removed these two lines for work offline.
		//const unsubscribe = onAuthStateChange();
		//return unsubscribe;
	}, []);

	function onAuthStateChange() {
		auth.onAuthStateChanged(user => {
			console.log(user);
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
