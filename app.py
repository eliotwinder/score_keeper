# !/usr/bin/env python
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_object('config')
db = SQLAlchemy(app)

@app.route('/player_/<player_name>', methods=['GET', 'POST'])
def PlayerHandler(player_name):
    if request.method == 'GET':
        return get_player__info(player_name)
    if request.method == 'POST':
        return create_player_(player_name)


@app.route('/game', methods=['POST'])
def GameHandler(player_name):
    if request.method == 'GET':
        return get_game_info(game_id)
    if request.method == 'POST':
        return create_game(**request.body)
