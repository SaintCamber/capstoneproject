from flask import Blueprint, request, abort, session, current_app, flash,redirect,jsonify
from flask_login import current_user
from flask_wtf.csrf import CSRFProtect, generate_csrf
from app.models import Song, Album, Artist, db

from app.forms.upload_song_form import UploadForm
import os
from app.utils.b2_helpers import (
    get_unique_filename,
    upload_file_to_b2,
    authorize_account,
    get_upload_url,
    allowed_file,
    upload_to_b2
)
from dotenv import load_dotenv

admin_routes = Blueprint("admin", __name__, url_prefix="/admin")
load_dotenv()
BUCKET_NAME = os.environ.get("bucket_name")
account_id = os.getenv("accountId")
application_key_id = os.getenv("B2_KEY")
application_key = os.getenv("B2_SECRET")


bucketId = os.getenv("bucketId")
token = authorize_account(account_id,application_key_id,application_key)["authorizationToken"]
apiUrl =authorize_account(account_id,application_key_id,application_key)["apiUrl"]
    
uploadUrl = get_upload_url(apiUrl,token,bucketId)["uploadUrl"]
# print(uploadUrl)
uploadAuth = get_upload_url(apiUrl,token,bucketId)["authorizationToken"]
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
    # Check if file was included in request
    if "song_file" not in request.files:
        return jsonify(error="No file provided"), 400

    file = request.files["song_file"]
    print(file)

    # Check if file has an allowed extension
    if not allowed_file(file.filename):
        return {"error":"File type not allowed","status_code":400}

    # Upload file to S3
    try:
        url =  upload_file_to_b2(file)

    except Exception as e:
        return {"error":str(e), "status_code":500}

    return {"url":url}


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
