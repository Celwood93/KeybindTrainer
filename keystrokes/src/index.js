import React from 'react';
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom';
import './stylesheets/index.css';
import App from './components/Game/App';
import Auth from './components/Auth/auth';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Container />, document.getElementById('root'));
registerServiceWorker();

function Button() {
    return <div>BUtton</div>
}

class Container extends React.Component {
    constructor() {
        
    }
    handleClick = () => {
        console.log('do stuff')
    }
    
    handleClickspecial = ()=> {

    }

    render() {
        return <View handleClick={this.handleClick} handleClickspecial={this.handleClickspecial}/>
    }
}


function View({handleClick, handleClickspecial}) {
    return (
        <div>
            <Button onClick={handleClick} />
            <Button onClick={handleClick}/>

            <Button onClick={handleClickspecial}/>
            <Button/>
            <Button onClick={handleClickspecial}/>
            <Button/>
            <div>
            <Button/>
            <Button/>
            </div>
        </div>
    )
}

View.propTypes = {
    handleClick: PropTypes.func,
    handleClickspecial: PropTypes.func,
}