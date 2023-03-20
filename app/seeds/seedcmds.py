from datetime import datetime
import random
from faker import Faker
from sqlalchemy.sql import text
from app.models import db, User, environment, SCHEMA
from app.models.modelsfile import db, Artist, Album, Song, Playlist, PlaylistSong

fake = Faker()


def create_artists(num_artists):
    for i in range(num_artists):
        artist = Artist(
            name=fake.name(),
            genre=random.choice(["Rock", "Pop", "Hip Hop", "Electronic"]),
        )
        db.session.add(artist)
    db.session.commit()


def create_albums(num_albums):
    artists = Artist.query.all()
    for i in range(num_albums):
        album = Album(artist=random.choice(artists))
        db.session.add(album)
    db.session.commit()


def create_songs(num_songs):
    artists = Artist.query.all()
    albums = Album.query.all()
    for i in range(num_songs):
        song = Song(
            link=fake.url(),
            artist=random.choice(artists),
            album=random.choice(albums),
            genre=random.choice(["Rock", "Pop", "Hip Hop", "Electronic"]),
        )
        db.session.add(song)
    db.session.commit()


def create_playlists(num_playlists):
    users = User.query.all()
    for i in range(num_playlists):
        playlist = Playlist(user=random.choice(users))
        db.session.add(playlist)
    db.session.commit()


def add_songs_to_playlists(num_songs_per_playlist):
    playlists = Playlist.query.all()
    songs = Song.query.all()
    for playlist in playlists:
        songs_for_playlist = random.sample(songs, num_songs_per_playlist)
        for song in songs_for_playlist:
            playlist_song = PlaylistSong(song=song, playlist=playlist)
            db.session.add(playlist_song)
    db.session.commit()


def undo_seeds():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.playlists RESTART IDENTITY CASCADE;"
        )
        db.session.execute(f"TRUNCATE table {SCHEMA}.songs RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.albums RESTART IDENTITY CASCADE;")
        db.session.execute(f"TRUNCATE table {SCHEMA}.artists RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
