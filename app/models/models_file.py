from .db import db


class Artist(db.Model):
    if environment == "production":
        __table_args__ = {"schema": SCHEMA}
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)

    genre = db.Column(db.String(255), nullable=False)
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
            "genre": self.genre,
            "albums": [album.to_dict() for album in self.albums],
            "songs": [song.to_dict() for song in self.songs],
        }


class Album(db.Model):
    if environment == "production":
        __table_args__ = {"schema": SCHEMA}
    id = db.Column(db.Integer, primary_key=True)
    artist_id = db.Column(
        db.Integer, db.ForeignKey("artist.id", ondelete="CASCADE"), nullable=False
    )
    name = db.Column(db.String, nullable=False, unique=True)
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
    if environment == "production":
        __table_args__ = {"schema": SCHEMA}
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    file_url = db.Column(db.String(255), nullable=False)
    artist_id = db.Column(db.Integer, db.ForeignKey("artist.id", ondelete="CASCADE"))
    album_id = db.Column(db.Integer, db.ForeignKey("album.id", ondelete="CASCADE"))
    genre = db.Column(db.String(255), nullable=False)
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
            "artist_id": self.artist_id,
            "artist": self.artist.name,
            "album_id": self.album_id,
            "album": self.album.name,
            "genre": self.genre,
            "playlists": [playlist.to_dict() for playlist in self.playlists],
            "file_url": self.file_url,
        }


class Playlist(db.Model):
    if environment == "production":
        __table_args__ = {"schema": SCHEMA}
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False
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
            "songs": self.songs,
        }


class PlaylistSong(db.Model):
    if environment == "production":
        __table_args__ = {"schema": SCHEMA}
    id = db.Column(db.Integer, primary_key=True)
    song_id = db.Column(
        db.Integer, db.ForeignKey("song.id", ondelete="CASCADE"), nullable=False
    )
    playlist_id = db.Column(
        db.Integer, db.ForeignKey("playlist.id", ondelete="CASCADE"), nullable=False
    )
    song = db.relationship("Song", back_populates="playlists")
    playlist = db.relationship("Playlist", back_populates="songs")

    def to_dict(self):
        return {
            "id": self.id,
            "song_id": self.song_id,
            "playlist_id": self.playlist_id,
            "song": self.song.title,
        }
