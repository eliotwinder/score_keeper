import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import { TYPES } from '../actions/index';

const players = (state = {}, action) => {
    switch (action.type) {
        case TYPES.RECEIVE_PLAYERS:
            return action.players || {};
        default:
            return state;
    }
};

const viewState = (state = {}, action) => {
    switch (action.type) {
        case TYPES.CHANGE_VIEW:
            return Object.assign({}, state, action.params);
        default:
            return state;
    }
};

const rootReducer = combineReducers({
    players,
    viewState,
    routing,
});

export default rootReducer;
