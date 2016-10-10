import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import Chrome from './components/Chrome';
import ScoreBoardContainer from './containers/ScoreBoardContainer';
import AddGameContainer from './containers/AddGameContainer';
import AddPlayer from './components/AddPlayer';

export default (
    <Route path="/" component={App}>
        <Chrome />
        <IndexRoute component={ScoreBoardContainer} />
        <Route path="scoreboard" component={ScoreBoardContainer} />
            <Route path="scoreboard/:gametype" component={ScoreBoardContainer} />
            <Route path="scoreboard/:player/:gametype" component={ScoreBoardContainer} />
        <Route path="/addplayer" component={AddPlayer} />
        <Route path="/addgame" component={AddGameContainer} />
    </Route>
);
