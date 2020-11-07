import MuiAlert from '@material-ui/lab/Alert';
import React, { useState } from 'react';

export function alerter() {
	const [alert, setAlert] = useState({
		open: false,
		message: 'placeholder',
		type: 'placeholder',
	});
	return [alert, setAlert];
}
export function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}
