from flask_wtf import FlaskForm
from wtforms import StringField, FileField, SubmitField,URLField
from wtforms.validators import DataRequired


class UploadForm(FlaskForm):
    title = StringField("title", validators=[DataRequired()])
    artist = StringField("artist", validators=[DataRequired()])
    album = StringField("album", validators=[DataRequired()])
    genre = StringField("genre", validators=[DataRequired()])
    file_url = URLField("file_url", validators=[DataRequired()])