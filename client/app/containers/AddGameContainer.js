import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import { fetchPlayers, addGame } from '../actions';

import AddGame from '../components/AddGame';

const GAME_TYPES = {
    eightball: {
        losers: 1,
        winners: 1,
    },
    nineball: {
        losers: 1,
        winners: 1,
    },
    cutthroat: {
        losers: 2,
        winners: 1,
    },
    '2v2': {
        losers: 2,
        winners: 2,
    },
};

class AddGameContainer extends Component {
    static propTypes = {
        players: PropTypes.array,
        fetchPlayers: PropTypes.func,
        addGame: PropTypes.func,
    };

    constructor(props) {
        super(props);
        const defaultGameTypeName = Object.keys(GAME_TYPES)[0];
        this.state = {
            selectedGameType: defaultGameTypeName,
            winners: [],
            losers: [],
        };
        this.handleSelectGameType = this.handleSelectGameType.bind(this);
        this.handleSelectPlayer = this.handleSelectPlayer.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        this.props.fetchPlayers();
    }

    handleSelectGameType(e) {
        const newState = {};
        newState[e.target.name] = e.target.value;
        this.setState(newState);
    }

    handleSelectPlayer(e) {
        const gametype = e.target.name;
        const selection = this.state[gametype.slice()];

        const selectionIndex = e.target.getAttribute('data-index');

        selection[selectionIndex] = e.target.value;

        const newState = {};
        newState[gametype] = selection;
        this.setState(newState);
    }

    onSubmit() {
        this.props.addGame({
            gametype: this.state.selectedGameType,
            winners: this.state.winners,
            losers: this.state.losers,
        });
        browserHistory.push('/');
    }

    render() {
        return (
            <AddGame players={this.props.players}
                gameTypes={GAME_TYPES}
                selectedGameType={this.state.selectedGameType}
                addGame={this.props.addGame}
                handleSelectGameType={this.handleSelectGameType}
                handleSelectPlayer={this.handleSelectPlayer}
                onSubmit={this.onSubmit} />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        players: Object.keys(state.players),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchPlayers: () => dispatch(fetchPlayers()),
        addGame: (game) => dispatch(addGame(game))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddGameContainer);
