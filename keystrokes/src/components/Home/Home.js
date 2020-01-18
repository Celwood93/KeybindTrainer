import React, { useState, useEffect } from 'react';
import Game from '../Game/Game';
import Nav from '../NavBar/NavBar';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ref } from '../../config/constants';
import CharacterList from '../Character/CharacterList';

function Home(props) {
	console.log(props);
	const userId = props.user.email.replace(/[.$#[\]]/g, '');
	const userPath = `/Users/${userId}`;
	const [user, setUser] = useState({
		characters: {},
		currentCharacter: null,
	});

	useEffect(() => {
		async function collectUserInfo() {
			const snapShot = await ref.child(userPath).once('value');
			if (snapShot.exists()) {
				setUser(snapShot.val());
			}
		}
		collectUserInfo();
	}, []);

	return (
		<BrowserRouter>
			<div className="App">
				<Route path="/" component={Nav} />
				<Switch>
					<Route path="/" exact component={LandingPage} />
					<Route
						path="/characterList"
						exact
						render={props => (
							<CharacterList
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
