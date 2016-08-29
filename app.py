# !/usr/bin/env python
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy

from models import get_models

app = Flask(
    __name__,
    static_url_path=''
)
app.config.from_object('config')

db = SQLAlchemy(app)
Player, Game = get_models(db)


@app.route('/')
def HomepageHandler():
    return app.send_static_file('index.html')


@app.route('/players', methods=['GET'])
def AllPlayersRoute():
    if request.method == 'GET':
        print jsonify(Player.get_all_players()).data
        return jsonify(Player.get_all_players())


@app.route('/player', methods=['POST'])
def CreatePlayerHandler():
    try:
        playername = request.form['playername']
        player = Player(playername)
        db.session.add(player)
        db.session.commit()
        return jsonify(player.get_stats())
    except:
        # most likely, the user is already created
        return 403


@app.route('/player/<playername>', methods=['GET'])
def GetPlayerInfoHandler(player_name):
    return Player.get_players_info(player_name)

# @app.route('/game', methods=['GET', 'POST'])
# def GameHandler(player_name):
#     if request.method == 'GET':
#         # return get_game_info(game_id)
#     if request.method == 'POST':
#         # return create_game(**request.body)

if __name__ == "__main__":
    app.run(debug=True)
