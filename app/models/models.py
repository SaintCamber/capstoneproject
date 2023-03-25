# from __future__ import annotations
from .db import db, environment, SCHEMA, add_prefix_for_prod
from .user import User

# from flask_login import UserMixin
# class Test(db.Model):
# __tablename__ = "tests"
# id= db.Column(db.Integer, primary_key=True)


class Artist(db.Model):
    __tablename__ = "artists"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)

    albums = db.relationship(
        "Album", back_populates="artist", cascade="all, delete-orphan"
    )
    songs = db.relationship(
        "Song", back_populates="artist", cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "albums": [album.to_dict() for album in self.albums],
            "songs": [song.to_dict() for song in self.songs],
        }


class Album(db.Model):
    __tablename__ = "albums"
    if environment == "production":
        __table_args__ = {"schema": SCHEMA}
    id = db.Column(db.Integer, primary_key=True)
    artist_id = db.Column(
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("artists.id")),
        nullable=False,
    )
    name = db.Column(db.String, nullable=False)
    release_date = db.Column(db.String, nullable=False)
    album_art = db.Column(db.String(255), nullable=True)
    artist = db.relationship("Artist", back_populates="albums")

    songs = db.relationship(
        "Song", back_populates="album", cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "artist_id": self.artist_id,
            "artist": self.artist.name,
            "songs": [song.to_dict() for song in self.songs],
        }


class Song(db.Model):
    __tablename__ = "songs"
    if environment == "production":
        __table_args__ = {"schema": SCHEMA}
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    file_url = db.Column(db.String(255), nullable=False)
    artist_id = db.Column(
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("artists.id")),
    )
    album_id = db.Column(
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("albums.id")),
    )

    playlists = db.relationship(
        "Playlist", secondary="playlists_songs", back_populates="songs"
    )

    artist = db.relationship("Artist", back_populates="songs")
    album = db.relationship("Album", back_populates="songs")

    def to_dict(self):
        return {
            "id": self.id,
            "file_url": self.file_url,
            "title": self.title,
            "artist": self.artist.name,
            "album": self.album.name,
            "playlists": [playlist.to_dict() for playlist in self.playlists],
        }


class Playlist(db.Model):
    __tablename__ = "playlists"
    if environment == "production":
        __table_args__ = {"schema": SCHEMA}
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("users.id")),
        nullable=False,
    )
    songs = db.relationship(
        "Song", secondary="playlists_songs", back_populates="playlists"
    )
    user = db.relationship("User", back_populates="playlists")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "user_id": self.user_id,
            "user": self.user.to_dict(),
            "songs": [song.to_dict() for song in self.songs],
        }


playlists_songs = db.Table(
    "playlists_songs",
    db.Model.metadata,
    db.Column(
        "song_id",
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("songs.id")),
        primary_key=True,
    ),
    db.Column(
        "playlist_id",
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("playlists.id")),
        primary_key=True,
    ),
)
if environment == "production":
    playlists_songs.schema = SCHEMA
