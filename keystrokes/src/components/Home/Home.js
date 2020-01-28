import React, { useState, useEffect } from 'react';
import Game from '../Game/Game';
import Nav from '../NavBar/NavBar';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ref } from '../../config/constants';
import CharacterList from '../Character/CharacterList';
import CharacterDetailPage from '../Character/CharacterDetailPage';

function Home(props) {
	console.log(props.user);
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
		function workOffline() {
			setUser({
				characters: {
					randomId1: { name: 'bill' },
					randomId2: { name: 'joe' },
					randomId3: { name: 'steve' },
				},
				currentCharacter: 'randomId1',
			});
		}
		workOffline();
		//removing for offline use
		//collectUserInfo();
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
						path="/characterList/*"
						render={props => (
							<CharacterDetailPage {...props} userId={userId} /> //this will probably need more stuff to make it so you cant just jump on someones account. maybe this is where i need privilages?
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
