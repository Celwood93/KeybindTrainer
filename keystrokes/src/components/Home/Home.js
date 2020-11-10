import React, { useState, useEffect } from 'react';
import Game from '../Game/Game';
import Nav from '../NavBar/NavBar';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { AllSpellsContext } from '../../contexts/AllSpellsContext';
import { ref } from '../../config/constants';
import CharacterList from '../Character/CharacterLists/CharacterList';
import CharacterDetailPage from '../Character/CharacterDetails/CharacterDetailPage';

function Home(props) {
	const userId = props.user.email.replace(/[.$#[\]]/g, '');
	const userPath = `/Users/${userId}`;
	const [user, setUser] = useState({
		characters: {},
		currentCharacter: null,
	});
	const [allSpells, setAllSpells] = useState();

	async function collectUserInfo() {
		try {
			const snapShot = await ref.child(userPath).once('value');
			if (snapShot.exists()) {
				return snapShot.val();
			}
		} catch (e) {
			console.error(`failed to get value at ${userPath}`);
		}
		return null;
	}

	useEffect(() => {
		let listener;
		try {
			listener = ref.child(userPath).on('value', change => {
				if (change && change.exists()) {
					setUser(change.val());
				}
			});
		} catch (e) {
			console.error(`failed to update value at ${userPath}`);
		}
		async function gettingUser() {
			const user = await collectUserInfo();
			setUser(user);
		}
		gettingUser();
		return listener;
	}, []);

	useEffect(() => {
		async function getAllSpells() {
			try {
				const snapShot = await ref.child(`/AllSpells/`).once('value');
				if (snapShot.exists()) {
					setAllSpells(snapShot.val());
				}
			} catch (e) {
				console.error(`failed to get value at ${userPath}`);
			}
		}
		getAllSpells();
	}, []);

	return (
		<div>
			{allSpells ? (
				<AllSpellsContext.Provider value={allSpells}>
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
											collectUserInfo={collectUserInfo}
											userPath={userPath}
										/>
									)}
								/>
								<Route
									path="/characterList/:id/:fields?"
									render={props => (
										<CharacterDetailPage
											{...props}
											userId={userId}
										/> //this will probably need more stuff to make it so you cant just jump on someones account. maybe this is where i need privilages?
									)}
								/>
								<Route
									path="/game"
									exact
									render={props => (
										<Game {...props} userInfo={user} />
									)}
								/>
							</Switch>
						</div>
					</BrowserRouter>
				</AllSpellsContext.Provider>
			) : (
				<div>Loading</div>
			)}
		</div>
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
