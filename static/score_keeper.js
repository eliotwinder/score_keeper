var GAMETYPES = {
    'cutthroat': {
        winners: 1,
        losers: 2
    },
    '2p8ball': {
        winners: 1,
        losers: 1
    },
    '4p8ball': {
        winners: 2,
        losers: 2
    },
};

function getPlayersInfo() {
    return $.get('players')
                .done(function(res) {
                    return res;
                });
}


function createPlayer(playername) {
    return $.post('player', {playername: playername})
        .done(function(data) {
            console.log('Created new user', data);
        })
        .fail(function(err) {
            console.log('Failed creating new user', err);
        });
}

function playerInputTemplate() {
    return $(`
        <form>
            <input type="text" id="playername-input" />
            <input type="submit" value="add player" />
        </form>`)
            .submit(function(e) {
                e.preventDefault();        
                var playername = $('#playername-input').val();
                createPlayer(playername);
        });
}

function makePlayerInputs(gameType) {
    var numberOfWinners = GAMETYPES[gameType].winners;
    var numberOfLosers = GAMETYPES[gameType].losers;
    var playerInputs = [];

    var makePlayerOption = function(player){
        return $(`<option value=\"${player.playername}\">${player.playername}</option>`);
    };

    return getPlayersInfo()
        .then(function(players) {
            var $playerInputs = [];
            for (var i = 1;  i < numberOfWinners + 1; i++) {
                var $playerInputWrapper = $(`<div>winner ${i}: </div>`);
                var $playerInput = $(`<select id=\"winner${i}\" / >`);
                var $playerOptions = players.map(makePlayerOption);
                $playerInput.append($playerOptions);
                $playerInputWrapper.append($playerInput);
                $playerInputs.push($playerInputWrapper);   
            }
            for (var i = 1;  i < numberOfLosers + 1; i++) {
                var $playerInputWrapper = $(`<div>loser ${i}: </div>`);
                var $playerInput = $(`<select id=\"loser${i}\" / >`);
                var $playerOptions = players.map(makePlayerOption);
                $playerInput.append($playerOptions);
                $playerInputWrapper.append($playerInput);
                $playerInputs.push($playerInputWrapper);   
            }
            return $playerInputs;
        });
}


function gameInputTemplate() {
    var $gameForm = $(`<form />`)
            .submit(function(e) {
                e.preventDefault();        
                var playername = $('#playername-input').val();
                createPlayer(playername);
            });

    // add gametype select
    var $gameTypeInput = $('<select id="gametype-input" />');

    // add gametype options
    var $gameTypeOptions = Object.keys(GAMETYPES).map(function(gameType) {
        return $(`<option value="${gameType}">${gameType}</option>`);
    });
    $gameTypeOptions[0].prop("selected", true);
    $gameTypeInput.append($gameTypeOptions);
    $gameForm.append($gameTypeInput);
    $playerInputs = $(`<div />`);
    $gameForm.append($playerInputs);
    var currentGameType = $gameTypeInput.val();
    makePlayerInputs(currentGameType)
        .done(function(playerInputs) {
            $playerInputs.append(playerInputs);
        });
    $playerInputs.append();
    $gameTypeInput.change(function() {
        var currentGameType = $gameTypeInput.val();
        $playerInputs.empty();
        makePlayerInputs(currentGameType)
            .done(function(playerInputs) {
                $playerInputs.append(playerInputs);
            });
    });
    return $gameForm;
}

function playerStatsTemplate(player) {
    $stats = $(`<div>${player.playername}:</div>`);
    Object.keys(player.stats).forEach(function(statType) {
        var stats = player.stats[statType];
        var totalGames = stats.wins + stats.losses;
        var percentage = stats.wins / totalGames;
        var statTemplate = `<div>${statType}: ${stats.wins} / ${totalGames} ${percentage}</div>`;
        $stats.append(statTemplate);
    });
    return $stats;
}

function statboardTemplate(players) {
    var statboard = $('<div class="statboard" />');
    players.forEach(function(player) {
        statboard.append(playerStatsTemplate(player));
    });
    return statboard;
}


var eliot = {playername: 'eliot', stats: {}};
var kevin = {playername: 'kevin', stats: {}};
function makePage() {
    var html = $('<div />');
    getPlayersInfo()
        .done(function(players) {
            html.append(statboardTemplate(players));
            html.append(gameInputTemplate());
            html.append(playerInputTemplate());
            $('body').append(html);
        });
}

$(function(){
    makePage();
});













