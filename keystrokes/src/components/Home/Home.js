import React, { useState, useEffect } from 'react';
import Game from '../Game/Game';
import Nav from '../NavBar/NavBar';
import Character from '../Character/Character';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ref } from '../../config/constants';

function Home(props) {
	const [user, setUser] = useState({ userInfo: {} });

	useEffect(() => {
		const collectUserInfo = async () => {
			const k = `/Users/${props.user.email.replace(/[\.\$#\[\]]/g, '')}`;
			const snapShot = await ref.child(k).once('value');
			const userInfo = snapShot.exists() ? snapShot.val() : {};
			setUser(userInfo);
		};
		collectUserInfo();
	}, []);

	return (
		<BrowserRouter>
			<div className="App">
				<Route path="/" component={Nav} />
				<Switch>
					<Route path="/" exact component={LandingPage} />
					<Route
						path="/character"
						exact
						render={props => (
							<Character {...props} userInfo={user} />
						)}
					/>
					<Route
						path="/game"
						exact
						render={props => <Game {...props} userInfo={user} />}
					/>
				</Switch>
			</div>
		</BrowserRouter>
	);
}

const LandingPage = () => {
	return (
		<div>
			<h1>LandingPage</h1>
		</div>
	);
};

export default Home;
