export const TYPES = {
    RECEIVE_GAMES: 'RECEIVE_GAMES',
    ADD_PLAYER: 'ADD_PLAYER',
    RECEIVE_PLAYERS: 'RECEIVE_PLAYERS',
    CHANGE_VIEW: 'CHANGE_VIEW',
};

const ROOT = '/';
const ADD_GAME_URL = `${ROOT}game`;
const PLAYER_URL = `${ROOT}player`;
const PLAYERS_URL = `${ROOT}players`;

export function addGame(gameInfo) {
    return () => {
        return fetch(ADD_GAME_URL, {
            method: 'POST',
            body: JSON.stringify(gameInfo),
        });
    };
}

function receivePlayers(players) {
    return {
        type: TYPES.RECEIVE_PLAYERS,
        players: players ? players : {},
    };
}

export function fetchPlayers() {
    return (dispatch) => {
        return fetch(PLAYERS_URL)
            .then((response) => {
                return response.json();
            })
            .then((response) => {
                dispatch(receivePlayers(response.players));
            });
    };
}


export function addPlayer(playerInfo) {
    return (dispatch) => {
        return fetch(PLAYER_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: playerInfo,
        }).then(() => {
            dispatch(fetchPlayers());
        });
    };
}

export function changeView(param, value) {
    const ret = {
        type: TYPES.CHANGE_VIEW,
        params: {},
    };
    ret.params[param] = value;
    return ret;
}
