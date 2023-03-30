from ..models.db import db
from flask_wtf import FlaskForm
from wtforms.fields import StringField, IntegerField, SubmitField, DateField
from wtforms.validators import DataRequired


class ArtistForm(FlaskForm):
    name = StringField(validators=[DataRequired()])
