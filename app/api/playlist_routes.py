import b2sdk.v2 as b2
from flask import (
    Blueprint,
    request,
    abort,
    session,
    current_app,
    flash,
    redirect,
    jsonify,
)
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_login import current_user, login_required
from functools import wraps
from app.models import (
    Artist,
    Song,
    Album,
    Playlist,
    playlists_songs,
    User,
    db,
    environment,
    SCHEMA,
)
import requests
import json
from app.forms.upload_song_form import UploadForm
from app.forms import ArtistForm, PlaylistForm
import os
import base64
from app.utils.b2_helpers import *
from dotenv import load_dotenv
from sqlalchemy import select
from flask_login import current_user

# from app.models import Playlist, db

playlist_routes = Blueprint("playlists", __name__, url_prefix="/api/playlists")


@playlist_routes.before_request
def https_redirect():
    if os.environ.get("FLASK_ENV") == "production":
        if request.headers.get("X-Forwarded-Proto") == "http":
            url = request.url.replace("http://", "https://", 1)
            code = 301
            return redirect(url, code=code)


@playlist_routes.after_request
def inject_csrf_token(response):
    response.set_cookie(
        "csrf_token",
        generate_csrf(),
        secure=True if os.environ.get("FLASK_ENV") == "production" else False,
        samesite="Strict" if os.environ.get("FLASK_ENV") == "production" else None,
        httponly=True,
    )
    return response


# grab a users playlists
@playlist_routes.route("/user")
@login_required
def playlists():
    id = current_user.id
    playlists = Playlist.query.filter(Playlist.user_id == id).all()
    print(playlists)
    return [playlist.to_dict() for playlist in playlists]


@playlist_routes.route("/<int:id>")
def playlistPage(id):
    playlist = Playlist.query.filter(Playlist.id == id).first()
    return playlist.to_dict()


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
    return [{f"{song.id}": song.to_dict()} for song in songs]


# Update a playlist info
@playlist_routes.route("/update/<int:id>", methods=["PUT"])
@login_required
def update_playlist(id):
    playlist = Playlist.query.get(id)
    form = PlaylistForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    if form.validate_on_submit():
        playlist.name = form.data["name"]
        db.session.commit()
        return playlist.to_dict()


# add song to playlist
@playlist_routes.route("/addSong/<int:id>", methods=["POST"])
# @login_required
def add_song_to_playlist(id):
    playlist = Playlist.query.get(id)
    print(request.json)

    song1 = request.json["song"]
    print(song1, "the song -------------------------------------------------")
    song_id = song1["id"]
    print(song_id, "the song ifd ")
    song = Song.query.get(song_id)
    playlist.songs.append(song)
    song.playlists.append(playlist)
    db.session.commit()
    return playlist.to_dict()


# remove a song from a playlist
@playlist_routes.route("/<int:playlistId>/songs/<int:songId>", methods=["DELETE"])
@login_required
def remove_song_from_playlist(playlistId, songId):
    playlist = Playlist.query.get(playlistId)
    playlist.songs = [song for song in playlist.songs if song.id != songId]
    db.session.commit()
    return playlist.to_dict()


# Delete a playlist
@playlist_routes.route("/delete/<int:id>", methods=["DELETE"])
@login_required
def delete_playlist(id):
    playlist = Playlist.query.get(id)
    db.session.delete(playlist)
    db.session.commit()
    return {"message": "Playlist deleted"}


# get all albums
@playlist_routes.route("/albums")
def get_albums():
    albums = Album.query.all()
    return [album.to_dict() for album in albums]


# get a single album
@playlist_routes.route("/albums/<int:albumId>")
def get_album(albumId):
    album = Album.query.get(albumId)
    return album.to_dict()


# grab artist info for each of the playlists, and return it. i.e the artist name
# and the artist image(eventually), so what needs to happen is that the playlists
# get populated,then looped through and the artist info grabbed for each of the
# songs in the playlist, and then returned if not already in the artist list. so
# a set would be used to keep track of the artists already in the list, and then
# the artist info would be added to the list if not already in the list. then the
# list would be returned.
@playlist_routes.route("/Library/<int:UserId>/artists")
def LibraryArtists(UserId):
    # Get all of the playlists for a user
    playlists = (
        Playlist.query.join(Playlist.songs)
        .join(Song.artist)
        .filter(Playlist.user_id == UserId)
        .all()
    )
    # Create a set to hold all of the artists
    artistSet = set()
    # Create an array to hold all of the artist dictionaries
    artists = []
    # Loop through all of the playlists
    for playlist in playlists:
        # Loop through all of the songs in the playlist
        for song in playlist.songs:
            # If the artist is not in the set
            if song.artist not in artistSet:
                # Add the artist to the set
                artistSet.add(song.artist)
                # Add the artist dictionary to the array
                artists.append(song.artist.to_dict())
    # Return the array of artist dictionaries
    return jsonify(artists)
