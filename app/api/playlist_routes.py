from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import Playlist, Song, db
from app.forms.playlist_form import PlaylistForm, AddSongToPlaylist
from app.utils.b2_helpers import authorize_account

# from app.models import Playlist, db

playlist_routes = Blueprint("playlists", __name__)


# grab a users playlists
@playlist_routes.route("/user")
@login_required
def playlists():
    id = current_user.id
    playlists = Playlist.query.filter(Playlist.user_id == id).all()
    print(playlists)
    return [ playlist.to_dict() for playlist in playlists]


@playlist_routes.route("/<int:id>")
def playlistPage(id):
    playlist = Playlist.query.filter(Playlist.id == id).all()
    if current_user.id == playlist.user_id:
        return playlist.to_dict()
    else:
        return {"errors": "You are not authorized to view this playlist"}


# create a playlist
@playlist_routes.route("/create", methods=["POST"])
@login_required
def create_playlist():
    form = PlaylistForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    if form.validate_on_submit():
        playlist = Playlist(
            name=form.data["name"],
            user_id=current_user.id,
        )
        db.session.add(playlist)
        db.session.commit()
        return playlist.to_dict()


@playlist_routes.route("/songs")
@login_required
def get_songs():
    songs = Song.query.all()
    return {f"{song.id}": song.to_dict() for song in songs}


# Update a playlist info
@playlist_routes.route("/update/<int:id>", methods=["PUT"])
@login_required
def update_playlist(id):
    playlist = Playlist.query.get(id)
    form = PlaylistUpdateForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    if form.validate_on_submit():
        playlist.name = form.data["name"]
        playlist.description = form.data["description"]
        db.session.commit()
        return playlist.to_dict()


# add song to playlist
@playlist_routes.route("/addSong/<int:id>/", methods=["PUT"])
def add_song_to_playlist(id):
    form = AddSongToPlaylist()
    playlist = Playlist.query.get(id)

    song_id = request.json["song_id"]
    song = Song.query.get(song_id)
    playlist.songs.append(song_id)
    song.playlists.append(id)
    db.session.commit()
    return playlist.to_dict()


# remove a song from a playlist
@playlist_routes.route("/removeSong/<int:id>", methods=["PUT"])
def remove_song_from_playlist(id):
    playlist = Playlist.query.get(id)
    song_id = request.json["song_id"]
    playlist.songs.remove(song_id)
    db.session.commit()
    return playlist.to_dict()


# Delete a playlist
@playlist_routes.route("/delete/<int:id>", methods=["DELETE"])
def delete_playlist(id):
    playlist = Playlist.query.get(id)
    db.session.delete(playlist)
    db.session.commit()
