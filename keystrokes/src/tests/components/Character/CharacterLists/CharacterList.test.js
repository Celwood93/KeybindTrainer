import React from 'react';
import CharacterList from '../../../../components/Character/CharacterLists/CharacterList';
import { ref } from '../../../../config/constants';
import { render, act } from '@testing-library/react';

const pathName = '/Users/test@testcom';

async function collectUserInfo() {
	try {
		const snapShot = await ref.child(pathName).once('value');
		if (snapShot.exists()) {
			return snapShot.val();
		}
	} catch (e) {
		console.error(`failed to get value at ${pathName}`);
	}
	return null;
}

test('<CharacterList /> renders without crashing', async () => {
	const { getByText } = render(
		<CharacterList collectUserInfo={collectUserInfo} userPath={pathName} />
	);
	getByText('Character List');
});
