import React from 'react';
import Game from '../Game/Game';
import Nav from '../NavBar/NavBar';
import Character from '../Character/Character';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

function Home(props) {
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
						user={props.user}
					/>
					<Route
						path="/game"
						exact
						component={Game}
						user={props.user}
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
