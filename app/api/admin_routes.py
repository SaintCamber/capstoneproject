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
from flask_login import current_user
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
from app.utils.decorators import admin_only

admin_routes = Blueprint("admin", __name__, url_prefix="/admin")
load_dotenv()


@admin_routes.before_request
def https_redirect():
    if os.environ.get("FLASK_ENV") == "production":
        if request.headers.get("X-Forwarded-Proto") == "http":
            url = request.url.replace("http://", "https://", 1)
            code = 301
            return redirect(url, code=code)


@admin_routes.after_request
def inject_csrf_token(response):
    response.set_cookie(
        "csrf_token",
        generate_csrf(),
        secure=True if os.environ.get("FLASK_ENV") == "production" else False,
        samesite="Strict" if os.environ.get("FLASK_ENV") == "production" else None,
        httponly=True,
    )
    return response


def admin_only(func):
    @wraps(func)
    def wrapped_function(*args, **kwargs):
        if current_user.is_authenticated and current_user.email == "demo@aa.io":
            return func(*args, **kwargs)
        else:
            abort(403)

    return wrapped_function


@admin_routes.route("/upload", methods=["POST"], endpoint="upload_song")
# @admin_only
def upload_song():
    print(session.get("email"))

    form = UploadForm()
    if not form.validate_on_submit():
        return jsonify(form.errors)
    # Get the values of the application key ID and application key from environment variables
    application_key_id = os.environ.get("B2_KEY")
    application_key = os.environ.get("B2_SECRET")
    bucket_id = os.environ.get("bucketId")

    # Encode the application key ID and application key as a basic auth string
    id_and_key = f"{application_key_id}:{application_key}"
    print(id_and_key)
    basic_auth_string = "Basic" + base64.b64encode(id_and_key.encode()).decode()
    print(basic_auth_string)

    # Add the Authorization header to the request
    headers = {"Authorization": basic_auth_string}

    # Make the request to the Backblaze B2 API to authorize the account
    url = "https://api.backblazeb2.com/b2api/v2/b2_authorize_account"
    response = requests.get(url, headers=headers)
    response_data = json.loads(response.text)
    print(response_data)
    # Get the upload URL and authorization token from the response
    upload_url = response_data["apiUrl"] + "/b2api/v2/b2_get_upload_url"
    upload_auth_token = response_data["authorizationToken"]

    # Get the file data from the request
    file_data = request.files["file"]
    if file_data is None:
        return jsonify({"error": "No file uploaded"})

    # Get the input data for the artist, album, and song
    artist_name = request.form.get("artist_name")
    album_name = request.form.get("album_name")
    album_release_date = request.form.get("release_date")
    album_art = request.form.get("album_art")
    song_name = request.form.get("song_name")
    track = request.form.get("track_number")
    # Get the file name and content type
    file_data.filename = f"{artist_name.replace(' ','_')}-{album_name.replace(' ','_')}-{song_name.replace(' ','_')}-{track}-{get_unique_filename(file_data.filename)}"
    file_name = file_data.filename
    print(file_data.filename, "FILENAME")
    content_type = file_data.content_type

    # Get the upload URL form the bucket
    headers = {"Authorization": upload_auth_token}
    data = {"bucketId": bucket_id}
    response = requests.post(upload_url, headers=headers, json=data)
    response_data = json.loads(response.text)

    # Get the upload URL and upload token from the response
    upload_url = response_data["uploadUrl"]
    upload_token = response_data["authorizationToken"]
    print(request.form)

    # Upload the file to the bucket
    headers = {
        "Authorization": upload_token,
        "X-Bz-File-Name": file_name,
        "Content-Type": content_type,
        "X-Bz-Content-Sha1": "do_not_verify",
    }
    response = requests.post(upload_url, headers=headers, data=file_data.read())

    # Check if the artist already exists in the database
    existing_artist = Artist.query.filter_by(name=artist_name).first()
    if existing_artist:
        artist_id = existing_artist.id
    else:
        # Create a new artist in the database
        new_artist = Artist(name=artist_name)
        db.session.add(new_artist)
        db.session.commit()
        artist_id = new_artist.id

    # Check if the album already exists in the database
    existing_album = Album.query.filter_by(name=album_name).first()
    if existing_album:
        album_id = existing_album.id
    else:
        # Create a new album in the database
        new_album = Album(
            name=album_name,
            artist_id=artist_id,
            release_date=album_release_date,
            album_art=album_art,
        )
        db.session.add(new_album)
        db.session.commit()
        album_id = new_album.id
    song_url = "https://f005.backblazeb2.com/file/capstonestorage/" + f"{file_name}"
    newSong = Song(
        title=song_name, album_id=album_id, artist_id=artist_id, file_url=song_url
    )
    db.session.add(newSong)
    db.session.commit()
    return "File uploaded successfully!"


@admin_routes.route(
    "/songs/<int:id>", methods=["GET", "PUT", "DELETE"], endpoint="func2"
)
@admin_only


# Read Song
def read_song(id):
    song = Song.query.get_or_404(id)
    return song.to_dict()


# update song
def update_song(id):
    song = Song.query.get_or_404(id)
    song.title = request.json.get("title", song.title)
    song.artist_id = request.json.get("artist_id", song.artist_id)
    song.album_id = request.json.get("album_id", song.album_id)
    db.session.commit()
    return song.to_dict()


# Delete Song
def delete_song(id):
    song = Song.query.get_or_404(id)
    db.session.delete(song)
    db.session.commit()
    return "", 204


@admin_routes.route("/albums", methods=["POST"], endpoint="func3")
@admin_only
def Create_album():

    artist = Artist.query.filter_by(name=request.form.data["artist_name"]).first()
    newAlbum = Album(
        name=request.form.data["name"],
        artist_id=artist.id,
        release_date=request.form.data["release_date"],
        album_art=request.form.data["album_art"],
    )
    db.session.add(newAlbum)
    db.session.commit()


@admin_routes.route(
    "/albums/<int:id>", methods=["GET", "PUT", "DELETE"], endpoint="func5"
)
@admin_only
def read_album(id):
    if request.method == "GET":
        album = Album.query.get_or_404(id)
        return album.to_dict()


# Read Album


# Update Album
def update_album(id):
    if request.method == "PUT":
        album = Album.query.get_or_404(id)
        album.title = request.json.get("title", album.title)
        album.artist_id = request.json.get("artist_id", album.artist_id)
        db.session.commit()
        return album.to_dict()


# Delete Album
def delete_album(id):
    if request.method == "DELETE":
        album = Album.query.get_or_404(id)
        db.session.delete(album)
        db.session.commit()
        return "", 204


@admin_routes.route(
    "/artists/<int:id>", methods=["GET", "POST", "DELETE"], endpoint="func9"
)
@admin_only

# Read Artist
def read_artist(id):
    artist = Artist.query.get_or_404(id)
    return artist.to_dict()


# Update Artist
def update_artist(id):
    artist = Artist.query.get_or_404(id)
    artist.name = request.json.get("name", artist.name)
    db.session.commit()
    return artist.to_dict()


@admin_routes.route(
    "/delete_artist/<int:id>", methods=["DELETE"], endpoint="delete_artist"
)
@admin_only
def delete_artist(id):
    artist = Artist.query.get(id)
    if not artist:
        abort(404)
    # remove all songs by that artist from playlists
    songs = Song.query.filter_by(artist_id=id).all()
    for song in songs:
        playlists = song.playlists
        for playlist in playlists:
            playlist.songs.remove(song)
    # delete all songs by that artist
    for song in songs:
        db.session.delete(song)
    # delete all albums by that artist
    albums = Album.query.filter_by(artist_id=id).all()
    for album in albums:
        db.session.delete(album)
    # delete the artist
    db.session.delete(artist)
    db.session.commit()
    return jsonify("Artist deleted", 200)


@admin_routes.route("/artists/all", methods=["GET"], endpoint="func14")
def get_artists():
    # Fetch all the artists from the database

    artists = Artist.query.all()

    # Serialize the results into JSON format
    artists_json = [artist.to_dict() for artist in artists]

    # Return the results as a JSON response
    return artists_json


@admin_routes.route("/albums/all", methods=["GET"], endpoint="func13")
def get_albums():
    # Fetch all the albums from the database
    albums = Album.query.all()

    # Serialize the results into JSON format
    albums_json = [album.to_dict() for album in albums]

    # Return the results as a JSON response
    return jsonify(albums_json)


@admin_routes.route("/songs/all", methods=["GET"], endpoint="func15")
def get_Songs():
    # Fetch all the Songs from the database
    Songs = Song.query.all()
    SongDicts = [song.to_dict() for song in Songs]
    # Serialize the results into JSON format
    Songs_json = [song for song in SongDicts]

    # Return the results as a JSON response
    return jsonify(Songs_json)


@admin_routes.route("/artists/pages/all", methods=["GET"], endpoint="func41")
def get_artists():
    page = request.args.get("page", 1, type=int)
    artists = Artist.query.paginate(page, per_page=10)
    artists_json = [artist.to_dict() for artist in artists.items]
    return jsonify(
        {
            "items": artists_json,
            "hasNextPage": artists.has_next,
            "currentPage": artists.page,
            "totalPages": artists.pages,
        }
    )


@admin_routes.route("/albums/pages/all", methods=["GET"], endpoint="func31")
def get_albums():
    page = request.args.get("page", 1, type=int)
    albums = Album.query.paginate(page, per_page=10)
    albums_json = [album.to_dict() for album in albums.items]
    return jsonify(
        {
            "items": albums_json,
            "hasNextPage": albums.has_next,
            "currentPage": albums.page,
            "totalPages": albums.pages,
        }
    )


@admin_routes.route("/songs/pages/all", methods=["GET"], endpoint="func51")
def get_songs():
    page = request.args.get("page", 1, type=int)
    songs = Song.query.paginate(page, per_page=10)
    song_dicts = [song.to_dict() for song in songs.items]
    return jsonify(
        {
            "items": song_dicts,
            "hasNextPage": songs.has_next,
            "currentPage": songs.page,
            "totalPages": songs.pages,
        }
    )
