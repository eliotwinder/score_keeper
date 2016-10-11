import React, { Component, PropTypes } from 'react';

import Styles from './AddGame.css';

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

class AddGame extends Component {

    static propTypes = {
        players: PropTypes.arrayOf(PropTypes.string),
        gameTypes: PropTypes.object,
        selectedGameType: PropTypes.string,
        addGame: PropTypes.func,
        handleSelectGameType: PropTypes.func,
        handleSelectPlayer: PropTypes.func,
        onSubmit: PropTypes.func,
    }

    renderSelectGameType() {
        return (
            <select name="selectedGameType"
                className={Styles.select}
                value={this.props.selectedGameType}
                onChange={this.props.handleSelectGameType}>
                {Object.keys(this.props.gameTypes).map((gametype) => {
                    return (
                        <option value={gametype}
                            key={gametype}>
                            {capitalizeFirstLetter(gametype)}
                        </option>
                    );
                })}
            </select>
        );
    }

    renderSelectPlayers(playerType) {
        const gameType = this.props.gameTypes[this.props.selectedGameType];

        const numberOfPlayers = gameType[playerType];

        const content = [];

        for (let i = 0; i < numberOfPlayers; i++) {
            content.push(
                <select name={`${playerType}`}
                    className={Styles.select}
                    key={i}
                    data-index={i}
                    defaultValue=""
                    placeholder="this"
                    onChange={this.props.handleSelectPlayer} >
                    <option className={Styles.placeholder}
                        disabled
                        value="">
                        Select a player
                    </option>
                    {this.props.players.map((player, index)=> {
                        return (
                            <option value={player}
                                key={index}>
                                {capitalizeFirstLetter(player)}
                            </option>
                        );
                    })}
                </select>
            );
        }

        return content;
    }

    render() {
        return (
            <div className={Styles.wrapper}>
                <div className={Styles.row} >
                    <div className={Styles.headercell}>Game Type</div>
                    <div className={Styles.headercell}>Winners</div>
                    <div className={Styles.headercell}>Losers</div>
                    <div className={Styles.headercell}></div>
                </div>
                <div className={Styles.row}>
                    <div className={Styles.bodycell}>
                        {this.renderSelectGameType()}
                    </div>
                    <div className={Styles.bodycell}>
                        {this.renderSelectPlayers('winners')}
                    </div>
                    <div className={Styles.bodycell}>
                        {this.renderSelectPlayers('losers')}
                    </div>
                    <div className={Styles.bodycell}>
                        <div className={Styles.button}
                            onClick={this.props.onSubmit}>
                            Submit
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddGame;
