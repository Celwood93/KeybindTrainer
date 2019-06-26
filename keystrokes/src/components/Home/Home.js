import { React, useState, useEffect } from 'react';
import Game from '../Game/Game';
import Nav from '../NavBar/NavBar';
import Character from '../Character/Character';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ref } from '../../config/constants';

async function Home(props) {
	//need to be using some use state and use effect stuff
	const k = `/Users/${props.user.email.replace(/[\.\$#\[\]]/g, '')}`;
	const snapShot = await ref.child(k).once('value');
	const userInfo = snapShot.exists() ? snapShot.val() : {};

	return (
		<BrowserRouter>
			<div className="App">
				<Route path="/" component={Nav} />
				<Switch>
					<Route path="/" exact component={LandingPage} />
					<Route
						path="/character"
						exact
						component={Character}
						userInfo={userInfo}
					/>
					<Route
						path="/game"
						exact
						component={Game}
						userInfo={userInfo}
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
