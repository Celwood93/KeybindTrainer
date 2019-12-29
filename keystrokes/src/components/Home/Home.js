import React, { useState, useEffect } from 'react';
import Game from '../Game/Game';
import Nav from '../NavBar/NavBar';
import Character from '../Character/Character';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ref } from '../../config/constants';

function Home(props) {
	const userId = props.user.email.replace(/[\.\$#\[\]]/g, '');
	const userPath = `/Users/${userId}`;
	const [user, setUser] = useState({ userInfo: {} });

	useEffect(() => {
		const collectUserInfo = async () => {
			const snapShot = await ref.child(userPath).once('value');
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
							<Character
								{...props}
								userInfo={user}
								userPath={userPath}
								userId={userId}
							/>
						)}
					/>
					<Route
						path="/game"
						exact
						render={props => (
							<Game
								{...props}
								userInfo={user}
								userPath={userPath}
							/>
						)}
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
