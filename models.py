"""
to initialize database do:
    db.create_all()
    db.session.commit()
"""
from collections import defaultdict


def get_models(db):
    class GamePlayer(db.Model):
        __tablename__ = 'game_player'
        id = db.Column(db.Integer, primary_key=True)
        game_id = db.Column(db.Integer, db.ForeignKey('game.id'))
        player_id = db.Column(db.Integer, db.ForeignKey('player.id'))
        win = db.Column(db.Boolean, nullable=False)

        player = db.relationship('Player', back_populates='games')
        game = db.relationship('Game', back_populates='players')

        @property
        def playername(self):
            return self.player.playername

        @property
        def gametype(self):
            return self.game.gametype

    class Player(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        playername = db.Column(db.String(80), unique=True)
        games = db.relationship('GamePlayer', back_populates='player')

        def __repr__(self):
            return '<Player %s>' % self.playername

        def __init__(self, playername):
            self.playername = playername
            db.session.add(self)

        def to_dict(self):
            return {
                'id': self.id,
                'playername': self.playername,
            }

        @classmethod
        def get_all_players(self):
            players = Player.query.all()
            return [player.get_stats() for player in players]

        def get_stats(self):
            '''
            returns a dict with key game type and value:
            {'wins': x, 'loses': y}
            also has one key, 'player_info' with aself-explanatory value
            '''
            stats = defaultdict(dict)
            for game in self.games:
                type_stats = stats[game.gametype]
                if game.win:
                    type_stats['wins'] = type_stats.get('wins', 0) + 1
                else:
                    type_stats['losses'] = type_stats.get('losses', 0) + 1
            total_wins = 0
            total_losses = 0
            for game_type, type_dict in stats.iteritems():
                total_wins += type_dict.get('wins', 0)
                total_losses += type_dict.get('losses', 0)
            stats['total'] = {'wins': total_wins, 'losses': total_losses}
            return {
                "playername": self.playername,
                "stats": stats
            }

    class Game(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        gametype = db.Column(db.String(80))
        players = db.relationship(
            'GamePlayer',
            back_populates='game',
        )

        def __init__(self, gametype, winners, losers):
            self.gametype = gametype
            for playername in winners:
                self.add_player(playername, win=True)
            for playername in losers:
                self.add_player(playername, win=False)
            db.session.add(self)

        def __repr__(self):
            return ('< Game %s: %s beat %s>' %
                    (self.gametype, self.winners, self.losers))

        @property
        def winners(self):
            return [player.playername
                    for player in self.players if player.win]

        @property
        def losers(self):
            return [player.playername
                    for player in self.players if not player.win]

        def add_player(self, playername, win):
            game_player = GamePlayer(win=win)
            player = Player.query.filter_by(playername=playername).first()
            game_player.player = player
            self.players.append(game_player)

    return Player, Game
