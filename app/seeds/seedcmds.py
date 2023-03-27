import os
import subprocess
from app.models import db, Song, Artist, Album, Playlist, playlists_songs, User
from app.models.db import environment, SCHEMA, db
from sqlalchemy.sql import text
from faker import Faker
import random

fake = Faker()
BUCKET_NAME = os.environ.get("bucket_name")
ALLOWED_EXTENSIONS = {"mp3", "wav", "flac", "m4p"}


def parse_filename(filename):
    artist_album_song_hash = filename.split("_")
    artist = artist_album_song_hash[0].replace("-", " ")
    album = artist_album_song_hash[1].replace("-", " ")
    song = artist_album_song_hash[2].replace("-", " ")
    return artist, album, song


def seeds():
    # List all the files in the bucket
    b2_ls_command = f"b2 ls {BUCKET_NAME}"
    output = subprocess.check_output(b2_ls_command.split()).decode()
    i = 0
    # Parse the files in the bucket and create a song entry for each
    while i < 5:
        for line in output.strip().split("\n"):
            file_name = line
            if file_name.endswith(tuple(ALLOWED_EXTENSIONS)):
                # Extract the song information from the file name
                artist_name, album_name, song_title = parse_filename(file_name)
                # Create or retrieve the artist
                artist = Artist.query.filter_by(name=artist_name).first()
                if not artist:
                    artist = Artist(name=artist_name)
                    db.session.add(artist)

                # Create or retrieve the album
                album = Album.query.filter_by(name=album_name, artist=artist).first()
                if not album:
                    album = Album(name=album_name, artist=artist)
                    db.session.add(album)

                b2_download_url_command = (
                    f"b2 get-download-url-with-auth {BUCKET_NAME} {file_name}"
                )
                output = subprocess.check_output(
                    b2_download_url_command.split()
                ).decode()
                file_url = output.strip()
                song = Song.query.filter_by(title=song_title, file_url=file_url).first()
                if song:
                    continue
                # Create the song entry
                song = Song(
                    title=song_title,
                    file_url=file_url,
                    artist=artist,
                    album=album,
                )
                db.session.add(song)
                i += 1

    # Commit the changes to the database
    db.session.commit()


def seed_playlists():
    users = User.query.all()
    songs = Song.query.all()
    for user in users:
        playlist = Playlist(user=user, name=fake.word())
        db.session.add(playlist)
        song_set = set()  # keep track of songs already added to playlist
        for song in songs:
            if song not in song_set:  # only add song if it hasn't already been added
                playlist.songs.append(song)
                song_set.add(song)

    db.session.commit()


def undo_seeds():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.playlists RESTART IDENTITY CASCADE;"
        ),
        db.session.execute(f"TRUNCATE table {SCHEMA}.songs RESTART IDENTITY CASCADE;"),
        db.session.execute(f"TRUNCATE table {SCHEMA}.albums RESTART IDENTITY CASCADE;"),
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.artists RESTART IDENTITY CASCADE;"
        ),
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
