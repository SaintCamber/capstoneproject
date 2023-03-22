from flask import Blueprint, jsonify, request

from app.models import Playlist, db

playlist_routes = Blueprint("playlists", __name__)

# get all playlists
@playlist_routes.route("/")
def playlists():
    playlists = Playlist.query.all()
    return {"playlists": [playlist.to_dict() for playlist in playlists]}


# grab a playlist by id (for now)
@playlist_routes.route("/<int:id>")
def playlist(id):
    playlist = Playlist.query.get(id)
    return playlist.to_dict()


# grab a users owned playlists
@playlist_routes.route("/user/<int:id>")
def user_playlists(id):
    playlists = Playlist.query.filter(Playlist.user_id == id).all()


# create a playlist
@playlist_routes.route("/create", methods=["POST"])
def create_playlist():
    form = PlaylistForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    if form.validate_on_submit():
        playlist = Playlist(
            name=form.data["name"],
            user_id=form.data["user_id"],
            description=form.data["description"],
        )
        db.session.add(playlist)
        db.session.commit()
        return playlist.to_dict()


# Update a playlist info
@playlist_routes.route("/update/<int:id>", methods=["PUT"])
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
@playlist_routes.route("/addSong/<int:id>", methods=["PUT"])
def add_song_to_playlist(id):
    playlist = Playlist.query.get(id)
    song_id = request.json["song_id"]
    playlist.songs.append(song_id)
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
