import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import classnames from 'classnames';

import Styles from './Scoreboard.css';

const GAME_TYPES = [
    'total',
    'eightball',
    'nineball',
    'cutthroat',
    '2v2',
];

const TO_UPPER = {
    'total': 'Total',
    'eightball': 'Eightball',
    'nineball': 'Nineball',
    'cutthroat': 'Cutthroat',
    '2v2': '2v2',
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

class Scoreboard extends Component {
    createRoute(destination) {
        return function routeToDestination() {
            browserHistory.push(destination);
        };
    }

    renderStats() {
        return this.props.stats.map((stat) => {
            return (
                <div className={Styles.row}
                    key={stat.name}>
                    <div className={classnames(Styles.cell, Styles.name)}
                        onClick={this.props.changeView('player', stat.name)}>
                        {capitalizeFirstLetter(stat.name)}
                    </div>
                    <div className={Styles.cell}>{stat.win_percentage}%</div>
                    <div className={Styles.cell}>{stat.wins}</div>
                    <div className={Styles.cell}>{stat.losses}</div>
                    <div className={Styles.cell}>{stat.total_games}</div>
                </div>
            );
        });
    }

    renderGameTypeLinks() {
        return GAME_TYPES.map((gametype) => {
            let className;
            if (this.props.currentGameType === gametype) {
                className = classnames(Styles.gametype, Styles.selected);
            } else {
                className = Styles.gametype;
            }
            return (
                <div className={className}
                    onClick={this.props.changeView('gameType', gametype)}
                    key={gametype}>
                    {TO_UPPER[gametype]}
                </div>
            );
        });
    }


    render() {
        return (
            <div className={Styles.wrapper}>
                <div className={Styles.header}>
                    <div className={Styles.h2}>
                        Showing Stats for
                    </div>
                    <div className={Styles.h1}>{capitalizeFirstLetter(this.props.playername)}</div>
                </div>
                <div className={Styles.gametypewrapper}>
                    {this.renderGameTypeLinks()}
                </div>
                <div className={Styles.table}>
                    <div className={Styles.headerrow}>
                        <div className={Styles.headercell}>Player</div>
                        <div className={Styles.headercell}>Win %</div>
                        <div className={Styles.headercell}>Wins</div>
                        <div className={Styles.headercell}>Losses</div>
                        <div className={Styles.headercell}>Total Games</div>
                    </div>
                    {this.renderStats()}
                </div>
            </div>
        );
    }
}

Scoreboard.propTypes = {
    currentGameType: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['player', 'game']),
    stats: PropTypes.array.isRequired,
    playername: PropTypes.string,
    changeView: PropTypes.func.isRequired,
};

Scoreboard.defaultProps = {
    playername: 'All Players',
};

export default Scoreboard;
