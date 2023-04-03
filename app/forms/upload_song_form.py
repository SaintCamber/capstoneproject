from flask_wtf import FlaskForm
from wtforms import StringField, FileField, SubmitField,URLField,IntegerField
from wtforms.validators import DataRequired


class UploadForm(FlaskForm):
    title = StringField("title", validators=[DataRequired()])
    artist_name = StringField("artist name", validators=[DataRequired()])
    album = StringField("album name", validators=[DataRequired()])
    release_date = StringField("releawse date", validators=[DataRequired()])
    file = FileField("file", validators=[DataRequired()])


class CombinedUploadForm(FlaskForm):
    Song_title = StringField("song_title", validators=[DataRequired()])
    artist_name = StringField("artist_name", validators=[DataRequired()])
    album_name = StringField("album_name", validators=[DataRequired()])
    file = FileField("file", validators=[DataRequired()])

    