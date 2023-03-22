from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms import SubmitField, StringField, IntegerField, SelectField
from wtforms.validators import DataRequired
from app.utils.b2_helpers import ALLOWED_EXTENSIONS
import os


class UploadForm(FlaskForm):
    
    csrf_token = os.environ.get("SECRET_KEY")
    title = StringField("title", validators=[DataRequired()])
    # artist = SelectField("artist", validators=[DataRequired()])
    artist = SelectField("Artist", validators=[DataRequired()])
    album = SelectField("album", validators=[DataRequired()])
    song_file = FileField(
        "song_file", validators=[FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS))]
    )
