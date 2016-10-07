"""
to initialize database do:
    db.create_all()
    db.session.commit()
"""


def get_models(db):
    class GamePlayer(db.Model):
        __tablename__ = 'game_player'
        id = db.Column(db.Integer, primary_key=True)
        game_id = db.Column(db.Integer, db.ForeignKey('game.id'))
        player_id = db.Column(db.Integer, db.ForeignKey('player.id'))
        win = db.Column(db.Boolean, nullable=False)

        player = db.relationship('Player', back_populates='games')
        game = db.relationship('Game', back_populates='players')

        def __repr__(self):
            win = 'yes' if self.win else 'no'
            return '<GamePlayer player: %s win: %s>' % (
                self.player.name, win)

        @property
        def name(self):
            return self.player.name

        @property
        def gametype(self):
            return self.game.gametype

        @property
        def winners(self):
            return [winner for winner in self.game.winners
                    if winner != self.player.name]

        @property
        def losers(self):
            return [loser for loser in self.game.losers
                    if loser != self.player.name]

    class Player(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        name = db.Column(db.String(80), unique=True)
        games = db.relationship('GamePlayer', back_populates='player')

        def __repr__(self):
            return '<Player %s>' % self.name

        def __init__(self, name):
            self.name = name
            db.session.add(self)

        def to_dict(self):
            return {
                'id': self.id,
                'name': self.name,
            }

        @classmethod
        def get_all_players(self):
            players = Player.query.all()
            return {
                player.name: player.get_stats()
                for player in players
            }

        def get_stats(self):
            '''
            returns a dict with key game type and value:
            {
                'wins': x,
                'losses': y,
                'opponents': {
                    'opponent_name': {
                        'wins': z,
                        'losses': h,
                    },
                }
            }
            '''
            stats = {}
            total_stats = {
                "wins": 0,
                "losses": 0,
                "opponents": {},
            }

            for game in self.games:
                type_stats = stats.get(game.gametype, {
                        'wins': 0,
                        'losses': 0,
                        'opponents': {},
                    })
                if game.win:
                    # increment total wins
                    total_stats['wins'] += 1

                    # increment wins for this gametype
                    type_stats['wins'] += 1

                    for loser in game.losers:
                        total_opponent = total_stats['opponents'].get(loser, {
                                "wins": 0,
                                "losses": 0,
                            })
                        total_opponent['wins'] += 1
                        total_stats['opponents'][loser] = total_opponent

                        opponent = type_stats['opponents'].get(loser, {
                                "wins": 0,
                                "losses": 0,
                            })
                        opponent['wins'] += 1
                        type_stats['opponents'][loser] = opponent
                else:
                    total_stats['losses'] += 1
                    type_stats['losses'] += 1

                    for winner in game.winners:
                        total_opponent = total_stats['opponents'].get(
                            winner, {
                                "wins": 0,
                                "losses": 0,
                            })
                        total_opponent['losses'] += 1
                        total_stats['opponents'][winner] = total_opponent

                        opponent = type_stats.get(winner, {
                                "wins": 0,
                                "losses": 0,
                            })
                        opponent['losses'] += 1
                        type_stats['opponents'][winner] = opponent
                stats[game.gametype] = type_stats

            stats['total'] = total_stats

            return stats

    class Game(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        gametype = db.Column(db.String(80))
        players = db.relationship(
            'GamePlayer',
            back_populates='game',
        )

        def __init__(self, gametype, winners, losers):
            self.gametype = gametype
            for name in winners:
                self._add_player(name, win=True)
            for name in losers:
                self._add_player(name, win=False)
            db.session.add(self)

        def __repr__(self):
            return ('< Game %s: %s beat %s>' %
                    (self.gametype, self.winners, self.losers))

        @property
        def winners(self):
            return [player.name
                    for player in self.players if player.win]

        @property
        def losers(self):
            return [player.name
                    for player in self.players if not player.win]

        def to_dict(self):
            return {
                "gametype": self.gametype,
                "winners": self.winners,
                "losers": self.losers,
            }

        def _add_player(self, name, win):
            game_player = GamePlayer(win=win)
            player = Player.query.filter_by(name=name).first()
            game_player.player = player
            self.players.append(game_player)

    db.session.commit()
    return Player, Game
