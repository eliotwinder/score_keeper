# !/usr/bin/env python
from flask import Flask, json, jsonify, request, make_response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from gevent.wsgi import WSGIServer

from models import get_models

app = Flask(
    __name__,
    static_url_path="/client/dist",
)
CORS(app)
app.config.from_object('config')
db = SQLAlchemy(app)
Player, Game = get_models(db)


@app.route('/players', methods=['GET'])
def AllPlayersRoute():
    resp = make_response((
        jsonify(players=Player.get_all_players()),
        200, {
            'Access-Control-Allow-Origin': '*',
        }))
    return resp


@app.route('/player', methods=['POST'])
def CreatePlayerHandler():
    playername = request.data
    if playername:
        try:
            player = Player(playername)
            db.session.add(player)
            db.session.commit()
            return jsonify(player.get_stats())
        except:
            # most likely, the user is already created
            return "%s already created" % playername
    return "can't make player with a blank name"


@app.route('/game', methods=['POST'])
def GameHandler(player_name=None):
    print "creating game %s" % request.data
    game = Game(**json.loads(request.data))
    db.session.add(game)
    db.session.commit()
    print "game created: %s" % game
    return "game created"


if __name__ == "__main__":
    db.create_all()
    http_server = WSGIServer(('', 5000), app)
    http_server.serve_forever()
