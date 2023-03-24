from flask_wtf import FlaskForm
from wtforms import StringField, FileField, SubmitField,URLField
from wtforms.validators import DataRequired


class UploadForm(FlaskForm):
    title = StringField("title", validators=[DataRequired()])
    artist = StringField("artist", validators=[DataRequired()])
    album = StringField("album", validators=[DataRequired()])
    genre = StringField("genre", validators=[DataRequired()])
    file = FileField("file", validators=[DataRequired()])


class CombinedUploadForm(FlaskForm):
    Song_title = StringField("song_title", validators=[DataRequired()])
    artist_name = StringField("artist_name", validators=[DataRequired()])
    album_name = StringField("album_name", validators=[DataRequired()])
    genre = StringField("genre", validators=[DataRequired()])
    file = FileField("file", validators=[DataRequired()])

    