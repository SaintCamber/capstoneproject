from __future__ import annotations
from .db import db, environment, SCHEMA, add_prefix_for_prod
from .user import User
from typing import List

from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column


class Artist(db.Model):
    __tablename__ = "artists"
    if environment == "production":
        __table_args__ = {"schema": SCHEMA}
    id: Mapped[int] = mapped_column(primary_key=True)
    name = mapped_column(db.String, nullable=False, unique=True)

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
    id: Mapped[int] = mapped_column(primary_key=True)
    artist_id: Mapped[int] = mapped_column(
        ForeignKey("artists.id", add_prefix_for_prod("artist.id"), onDelete="CASCADE"),
        nullable=False,
    )
    name = mapped_column(db.String, nullable=False, unique=True)
    release_date = mapped_column(db.DateTime, nullable=False)
    album_art = mapped_column(db.String(255), nullable=True)
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
    id: Mapped[int] = mapped_column(primary_key=True)
    title = mapped_column(db.String, nullable=False)
    file_url = mapped_column(db.String(255), nullable=False)
    artist_id = mapped_column(
        db.Integer,
        db.ForeignKey(
            "artists.id", add_prefix_for_prod("artists.id"), onDelete="CASCADE"
        ),
    )
    album_id = mapped_column(
        db.Integer,
        db.ForeignKey(
            "albums.id", add_prefix_for_prod("albums.id"), onDelete="CASCADE"
        ),
    )
    genre = mapped_column(db.String(255), nullable=False)
    playlists = db.relationship(
        "PlaylistSong", back_populates="song", cascade="all, delete-orphan"
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
            "genre": self.genre,
            "playlists": [playlist.to_dict() for playlist in self.playlists],
        }


class Playlist(db.Model):
    __tablename__ = "playlists"
    if environment == "production":
        __table_args__ = {"schema": SCHEMA}
    id: Mapped[int] = mapped_column(primary_key=True)
    name = mapped_column(db.String, nullable=False)
    user_id = mapped_column(
        db.Integer,
        db.ForeignKey("users.id", add_prefix_for_prod("users.id"), onDelete="CASCADE"),
        nullable=False,
    )
    songs = db.relationship(
        "PlaylistSong", back_populates="playlist", cascade="all, delete-orphan"
    )
    user = db.relationship("User", back_populates="playlists")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "user_id": self.user_id,
            "user": self.user.to_dict(),
            "songs": [song.to_dict() for sonf in self.songs],
        }


class PlaylistSong(db.Model):
    __tablename__ = "playlistsongs"
    if environment == "production":
        __table_args__ = {"schema": SCHEMA}
    id: Mapped[int] = mapped_column(primary_key=True)
    song_id = mapped_column(
        db.Integer,
        db.ForeignKey("songs.id", add_prefix_for_prod("songs.id"), onDelete="CASCADE"),
        nullable=False,
    )
    playlist_id = mapped_column(
        db.Integer,
        db.ForeignKey(
            "playlists.id", add_prefix_for_prod("playlists.id"), onDelete="CASCADE"
        ),
        nullable=False,
    )
    song = db.relationship("Song", back_populates="playlists")
    playlist = db.relationship("Playlist", back_populates="songs")

    def to_dict(self):
        return {
            "id": self.id,
            "song_id": self.song_id,
            "playlist_id": self.playlist_id,
            "song": self.song.to_dict(),
        }
