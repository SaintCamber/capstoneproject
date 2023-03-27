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
    # Parse the files in the bucket and create a song entry for each
    files = [
        "linkin-park_collision-course_Big-Pimpin-Papercut_9817f2cf-5ba0-47ca-86ec-99926d26b089.m4p",
        "linkin-park_collision-course_Dirt-Off-Your-Shoulder_d60a9d66-390e-4101-9a97-9a041d1b1eeb.m4p",
        "linkin-park_collision-course_Izzo-In-the-End_c45ae305-02a7-4923-a658-8aa19e6030de.m4p",
        "linkin-park_collision-course_Jigga-What-Faint_016fef5e-7627-4154-8cf2-99974e9df500.m4p",
        "linkin-park_collision-course_Points-of-Authority-99_Problems_e9b4d3cf-48d6-4432-9707-b63c9426126e.m4p",
    ]

    for file in files:
        # Extract the song information from the file name
        artist_name, album_name, song_title = parse_filename(file)
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

        file_url = f"https://f005.backblazeb2.com/file/capstonestorage/{file}"
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
