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
from flask_login import current_user
from flask_wtf.csrf import CSRFProtect, generate_csrf
from app.models import db, User
from app.models.models_file import Artist, Song, Album, Playlist, PlaylistSong
import hashlib
import requests
import boto3
import json
from app.forms.upload_song_form import UploadForm
import os
import io
from app.utils.b2_helpers import *
from dotenv import load_dotenv

admin_routes = Blueprint("admin", __name__, url_prefix="/admin")
load_dotenv()
# BUCKET_NAME = os.environ.get("bucket_name")
# BUCKET_ID = os.environ.get("bucket_id")
# account_id = os.getenv("accountId")


# BUCKET_KEY = os.environ.get("B2_KEY")
# BUCKET_ENDPOINT = os.environ.get("B2_LOCATION")

# b2_api = b2.B2Api()
# b2_api.authorize_account("production", BUCKET_ID, BUCKET_KEY)

# uploadUrl = get_upload_url(apiUrl,token,bucketId)["uploadUrl"]
# # print(uploadUrl)
# uploadAuth = get_upload_url(apiUrl,token,bucketId)["authorizationToken"]
# utility validation wrapper


def admin_only(func):
    def wrapper(*args, **kwargs):
        if session.get("user_type") != "admin":
            abort(403)
        return func(*args, **kwargs)

    return wrapper


# @admin_routes.before_request
# def headers():
#     if request.method == "POST":


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


# Route for uploading songs
@admin_routes.route("/upload", methods=["POST"])
def upload_song():
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

    # Get the file name and content type
    file_data.filename=get_unique_filename(file_data.filename)
    file_name = file_data.filename
    content_type = file_data.content_type

    # Get the upload URL for the bucket
    headers = {"Authorization": upload_auth_token}
    data = {"bucketId": bucket_id}
    response = requests.post(upload_url, headers=headers, json=data)
    response_data = json.loads(response.text)

    # Get the upload URL and upload token from the response
    upload_url = response_data["uploadUrl"]
    upload_token = response_data["authorizationToken"]


    
    # Get the input data for the artist, album, and song
    print(request.form,"the request.form")
    artist_name = request.form.get("artist_name")
    album_name = request.form.get("album_name")
    song_name = request.form.get("song_name")

    # Check if the artist already exists in the database
    existing_artist = db.session.execute(db.select(Artist).filter_by(name=artist_name)).first()
    if existing_artist:
        artist_id = existing_artist.id
    else:
        # Create a new artist in the database
        new_artist = Artist(name=artist_name)
        db.session.add(new_artist)
        db.session.commit()
        artist_id = new_artist.id

    # Check if the album already exists in the database
    existing_album = db.session.execute(db.select(Album)).filter_by(name=album_name, artist_id=artist_id).first()
    if existing_album:
        album_id = existing_album.id
    else:
        # Create a new album in the database
        new_album = Album(name=album_name, artist_id=artist_id)
        db.session.add(new_album)
        db.session.commit()
        album_id = new_album.id


    

    # Upload the file to the bucket
    headers = {
        "Authorization": upload_token,
        "X-Bz-File-Name": file_name,
        "Content-Type": content_type,
        "X-Bz-Content-Sha1": "do_not_verify"
    }
    response = requests.post(upload_url, headers=headers, data=file_data.read())

    # Print the response data
    print(response.text)
    song_url = "https://f005.backblazeb2.com/file/capstonestorage/" + f'{file_name}'

    newSong = Song(title=song_name, album_id=album_id,artist_id=artist_id, song_url=song_url)
    db.session.add(newSong)
    db.session.commit()
    return "File uploaded successfully!"
 
@admin_routes.route("/artists", methods=["GET"])
def get_artists():
    # Fetch all the artists from the database

    artists = Artist.query.all()

    # Serialize the results into JSON format
    artists_json = [artist.to_dict() for artist in artists]

    # Return the results as a JSON response
    return artists_json


@admin_routes.route("/albums", methods=["GET"])
def get_albums():
    # Fetch all the albums from the database
    albums = Album.query.all()

    # Serialize the results into JSON format
    albums_json = [album.to_dict() for album in albums]

    # Return the results as a JSON response
    return albums_json


# Read Song
@admin_routes.route("/songs/<int:id>", methods=["GET"], endpoint="func2")
# @admin_only
def read_song(id):
    song = Song.query.get_or_404(id)
    return song.to_dict()


# Update Song
@admin_routes.route("/songs/<int:id>", methods=["PUT"], endpoint="func3")
# @admin_only
def update_song(id):
    song = Song.query.get_or_404(id)
    song.title = request.json.get("title", song.title)
    song.artist_id = request.json.get("artist_id", song.artist_id)
    song.album_id = request.json.get("album_id", song.album_id)
    db.session.commit()
    return song.to_dict()


# Delete Song
@admin_routes.route("/songs/<int:id>", methods=["DELETE"], endpoint="func4")
# @admin_only
def delete_song(id):
    song = Song.query.get_or_404(id)
    db.session.delete(song)
    db.session.commit()
    return "", 204


# Create Album
@admin_routes.route("/albums", methods=["POST"], endpoint="func5")
# @admin_only
def create_album():
    title = request.json.get("title")
    artist_id = request.json.get("artist_id")
    album = Album(title=title, artist_id=artist_id)
    db.session.add(album)
    db.session.commit()
    return album.to_dict()


# Read Album
@admin_routes.route("/albums/<int:id>", methods=["GET"], endpoint="func6")
# @admin_only
def read_album(id):
    album = Album.query.get_or_404(id)
    return album.to_dict()


# Update Album
@admin_routes.route("/albums/<int:id>", methods=["PUT"], endpoint="func7")
# @admin_only
def update_album(id):
    album = Album.query.get_or_404(id)
    album.title = request.json.get("title", album.title)
    album.artist_id = request.json.get("artist_id", album.artist_id)
    db.session.commit()
    return album.to_dict()


# Delete Album
@admin_routes.route("/albums/<int:id>", methods=["DELETE"], endpoint="func8")
# @admin_only
def delete_album(id):
    album = Album.query.get_or_404(id)
    db.session.delete(album)
    db.session.commit()
    return "", 204


# Create Artist
@admin_routes.route("/artists", methods=["POST"], endpoint="func9")
# @admin_only
def create_artist():
    name = request.json.get("name")
    artist = Artist(name=name)
    db.session.add(artist)
    db.session.commit()
    return artist.to_dict()


# Read Artist
@admin_routes.route("/artists/<int:id>", methods=["GET"], endpoint="func10")
# @admin_only
def read_artist(id):
    artist = Artist.query.get_or_404(id)
    return artist.to_dict()


# Update Artist
@admin_routes.route("/artists/<int:id>", methods=["PUT"], endpoint="func11")
# @admin_only
def update_artist(id):
    artist = Artist.query.get_or_404(id)
    artist.name = request.json.get("name", artist.name)
    db.session.commit()
    return artist.to_dict()


# Delete Artist
@admin_routes.route("/artists/<int:id>", methods=["DELETE"], endpoint="func12")
# @admin_only
def delete_artist(id):
    artist = Artist.query.get_or_404(id)
    db.session.delete(artist)
    db.session.commit()
    return
