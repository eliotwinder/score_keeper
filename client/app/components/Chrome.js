import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { changeView } from '../actions';
import AddPlayer from './AddPlayer';

import Styles from './Chrome.css';

import CHIPPY from '../../static/hipmunk-logo@2x.png';
import TROPHY from '../../static/icon-trophy@2x.png';
import PLUS from '../../static/plus@2x.png';

class Chrome extends Component {
    static propTypes = {
        changeView: PropTypes.func.isRequired,
    }

    createRoute(destination) {
        return function routeToDestination() {
            this.props.changeView('player', 'all');
            browserHistory.push(destination);
        };
    }

    render() {
        return (
            <div>
                <div className={Styles.navbar}>
                    <div className={Styles.chippywrapper}>
                        <img className={Styles.chippy}
                            src={CHIPPY} />
                    </div>
                    <div className={Styles.standings}
                        onClick={this.createRoute('/').bind(this)}>
                        <div className={Styles.linkwrapper}>
                            <img className={Styles.trophy}
                                src={TROPHY} />
                            Standings
                        </div>
                    </div>
                </div>
                <div className={Styles.addthings}>
                    <div className={Styles.addgamewrapper} onClick={this.createRoute('addgame').bind(this)}>
                        <div className={Styles.addgame}>
                            <img className={Styles.plussign}
                                src={PLUS} />
                            <div className={Styles.addgametext}>
                                Add New Game
                            </div>
                        </div>
                    </div>
                    <div className={Styles.addplayerwrapper}>
                        <AddPlayer />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeView: (param, value) => dispatch(changeView(param, value)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chrome);
