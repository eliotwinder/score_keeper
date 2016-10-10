import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import { fetchPlayers, changeView } from '../actions';
import Scoreboard from '../components/Scoreboard';

class ScoreboardContainer extends Component {
    static propTypes = {
        players: PropTypes.object.isRequired,
        viewState: PropTypes.object.isRequired,
        fetchPlayers: PropTypes.func.isRequired,
        changeView: PropTypes.func.isRequired,
    }

    componentDidMount() {
        this.props.fetchPlayers();
    }

    sortByWinPercentage = (playerA, playerB) => {
        if (playerA.win_percentage > playerB.win_percentage) {
            return -1;
        }
        if (playerA.win_percentage < playerB.win_percentage) {
            return 1;
        }
        if (playerA.total_games > playerB.total_games) {
            return -1;
        }
        if (playerA.total_games < playerB.total_games) {
            return 1;
        }
        return 0;
    }

    makeStatsForPlayer(opponents) {
        return Object.keys(this.props.players)
            .filter((playerName) => {
                return playerName !== this.props.viewState.player;
            })
            .map((opponentName) => {
                const stat = opponents[opponentName] || {};

                stat.name = opponentName;
                if (!stat.wins) {
                    stat.wins = 0;
                }

                if (!stat.losses) {
                    stat.losses = 0;
                }

                stat.total_games = stat.wins + stat.losses;

                stat.win_percentage = 0;

                if (stat.total_games) {
                    stat.win_percentage = Math.floor((stat.wins / stat.total_games) * 100);
                } else {
                    stat.win_percentage = 0;
                }

                return stat;
            })
            .sort(this.sortByWinPercentage);
    }


    makeStats(statObject) {
        const players = Object.keys(statObject);
        const gametype = this.props.viewState.gameType;
        const playerByGameType = players.map((player) => {
            const stats = this.props.players[player][gametype] || {};
            stats.name = player;
            if (!stats.wins) {
                stats.wins = 0;
            }

            if (!stats.losses) {
                stats.losses = 0;
            }

            stats.total_games = stats.wins + stats.losses;

            stats.win_percentage = 0;

            if (stats.total_games) {
                stats.win_percentage = Math.floor((stats.wins / stats.total_games) * 100);
            } else {
                stats.win_percentage = 0;
            }
            return stats;
        })
            .sort(this.sortByWinPercentage);

        return playerByGameType;
    }

    createChangeView(param, value) {
        return () => {
            this.props.changeView(param, value);
        };
    }

    render() {
        if (Object.keys(this.props.players).length) {
            const { players, viewState } = this.props;
            const { player, gameType } = viewState;

            let statsToDisplay;
            if (player === 'all') {
                statsToDisplay = this.makeStats(this.props.players);
            } else if (!players[player][gameType]) {
                return (<div>This player has yet played a game of this type</div>);
            } else {
                const opponents = players[player][gameType].opponents;
                statsToDisplay = this.makeStatsForPlayer(opponents);
            }

            const playername = player === 'all' ? 'All players' : player;
            return (
                <Scoreboard stats={statsToDisplay}
                    playername={playername}
                    currentGameType={this.props.viewState.gameType}
                    changeView={this.createChangeView.bind(this)} />
            );
        }
        return <div>loading...</div>;
    }
}

const mapStateToProps = (state) => {
    return {
        players: state.players,
        viewState: state.viewState,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchPlayers: () => dispatch(fetchPlayers()),
        changeView: (param, value) => dispatch(changeView(param, value)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ScoreboardContainer);
