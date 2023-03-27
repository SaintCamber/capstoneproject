from flask import redirect, session
from functools import wraps
from flask_login import current_user
from app.models import Playlist

# function to validate that the logged in user is the owner of the playlist

from flask_login import current_user




# function to validate that the logged in user is the user allowed to add a
# song/artists/album to the database (admin) or in this case the demo user at user id 1
def admin_only(func):
    def wrapper(*args, **kwargs):
        if current_user.id != 1:
            return redirect("/")
        return func(*args, **kwargs)

    return wrapper
