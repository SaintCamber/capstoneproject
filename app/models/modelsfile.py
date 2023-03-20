from .db import db


class Artist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    genre = db.Column(db.String(255))
    albums = db.relationship(
        "Album", back_populates="artist", cascade="all, delete-orphan"
    )
    songs = db.relationship(
        "Song", back_populates="artist", cascade="all, delete-orphan"
    )


class Album(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    artist_id = db.Column(db.Integer, db.ForeignKey("artist.id", ondelete="CASCADE"))
    artist = db.relationship("Artist", back_populates="albums")
    songs = db.relationship(
        "Song", back_populates="album", cascade="all, delete-orphan"
    )


class Song(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    link = db.Column(db.String)
    artist_id = db.Column(db.Integer, db.ForeignKey("artist.id", ondelete="CASCADE"))
    album_id = db.Column(db.Integer, db.ForeignKey("album.id", ondelete="CASCADE"))
    genre = db.Column(db.String(255))
    playlists = db.relationship(
        "PlaylistSong", back_populates="song", cascade="all, delete-orphan"
    )
    artist = db.relationship("Artist", back_populates="songs")
    album = db.relationship("Album", back_populates="songs")


class Playlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"))
    songs = db.relationship(
        "PlaylistSong", back_populates="playlist", cascade="all, delete-orphan"
    )
    user = db.relationship(
        "User", back_populates="playlists")


class PlaylistSong(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    song_id = db.Column(db.Integer, db.ForeignKey("song.id", ondelete="CASCADE"))
    playlist_id = db.Column(
        db.Integer, db.ForeignKey("playlist.id", ondelete="CASCADE")
    )
    song = db.relationship("Song", back_populates="playlists")
    playlist = db.relationship("Playlist", back_populates="songs")
