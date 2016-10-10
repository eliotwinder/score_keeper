import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import { addPlayer } from '../actions';

import BUST from '../../static/user@2x.png';

import Styles from './AddPlayer.css';

class AddPlayer extends Component {

    static propTypes = {
        addPlayer: PropTypes.func,
    }

    constructor(props) {
        super(props);
        this.state = {
            playerName: '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            playerName: e.target.value,
        });
    }

    onSubmit(e) {
        e.preventDefault();
        this.props.addPlayer(this.state.playerName);
        this.setState({
            playerName: '',
        });
        browserHistory.push('/');
    }

    render() {
        return (
            <form className={Styles.form}
                onSubmit={this.onSubmit}>
                <img className={Styles.bustimage}
                    src={BUST} />
                <input className={Styles.input} type="text"
                    value={this.state.playerName}
                    placeholder="Add New Player"
                    onChange={this.handleChange} />
                <div className={Styles.button}
                    onClick={this.onSubmit}>
                    Submit
                </div>
            </form>
        );
    }
}

const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        addPlayer: (playerName) => dispatch(addPlayer(playerName)),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddPlayer);
