from datetime import datetime
import random
from faker import Faker
from sqlalchemy.sql import text
from app.models import db, User, environment, SCHEMA,Playlist,playlistsongs
from app.models.models import Song, Album, Artist

fake = Faker()


def undo_seeds():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.playlists RESTART IDENTITY CASCADE;"
        )
        db.session.execute(f"TRUNCATE table {SCHEMA}.songs RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.albums RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.artists RESTART IDENTITY CASCADE;")
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.playlists RESTART IDENTITY CASCADE;"
        )
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.playlist_songs RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM songs"))
        db.session.execute(text("DELETE FROM playlist_songs"))
        db.session.execute(text("DELETE FROM albums"))
        db.session.execute(text("DELETE FROM artists"))
        db.session.execute(text("DELETE FROM playlists"))

    db.session.commit()
