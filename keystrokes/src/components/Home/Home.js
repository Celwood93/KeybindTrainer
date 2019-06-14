import React from 'react';
import Game from '../Game/Game';
import Nav from '../NavBar/NavBar';
import '../../stylesheets/App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

function Home() {
	return (
		<BrowserRouter>
			<div className="App">
				<Route path="/" component={Nav} />
				<Switch>
					<Route path="/" exact component={LandingPage} />
					<Route path="/game" exact component={Game} />
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
