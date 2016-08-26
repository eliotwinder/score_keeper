from flask import jsonify

from app import db
from models import Game, GamePlayer, Player


def get_player_info(playername):
    try:
        player = Player.query.filter_by(playername=playername)
        return jsonify(player.to_dict())
    except:
        raise Exception


def create_player(playername):
    player = Player(playername)
    db.session.add(player)
    db.session.commit()
    return player


def create_game(gametype, winners, losers):
    game = Game(gametype)
    print game
    for playername in winners:
        print 'playername'
        print playername
        game.add_player(playername, True)
    for playername in losers:
        game.add_player(playername, False)
    db.session.add(game)
    db.session.commit()
    return game
