from flask_wtf import FlaskForm
from wtforms import StringField, FileField, SubmitField
from wtforms.validators import DataRequired


class UploadForm(FlaskForm):
    name = StringField("Name", validators=[DataRequired()])
    file = FileField("File", validators=[DataRequired()])
