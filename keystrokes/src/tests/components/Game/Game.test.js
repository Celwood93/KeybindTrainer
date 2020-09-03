import React from 'react';
import ReactDOM from 'react-dom';
import Game from '../../../components/Game/Game';
import { ref } from '../../../config/constants';
import { render, act } from '@testing-library/react';

let info = {};

async function collectUserInfo() {
	try {
		const snapShot = await ref.child('/Users/test@testcom').once('value');
		if (snapShot.exists()) {
			return snapShot.val();
		}
	} catch (e) {
		console.error(`failed to get value at ${`/Users/test@testcom`}`);
	}
	return null;
}

beforeAll(async () => {
	info = await collectUserInfo();
});

test('<Game /> renders without crashing', async () => {
	const { getByText } = render(<Game userInfo={info} />);
	expect(getByText('logo')).toBe(true);
});
