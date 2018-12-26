import React from 'react';
import ReactDOM from 'react-dom';
import './stylesheets/index.css';
//import App from './components/Game/App';
import Auth from './components/Auth/auth';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Auth />, document.getElementById('root'));
registerServiceWorker();
