from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired


class PlaylistForm(FlaskForm):
    name = StringField("name", validators=[DataRequired()])
    user_id = IntegerField("user_id", validators=[DataRequired()])


class AddSongToPlaylist(FlaskForm):
    song_id = IntegerField("song_id", validators=[DataRequired()])
    playlist_id = IntegerField("playlist_id", validators=[DataRequired()])
