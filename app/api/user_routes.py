from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, Song

user_routes = Blueprint("users", __name__)


@user_routes.route("/")
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {"users": [user.to_dict() for user in users]}


@user_routes.route("/<int:id>")
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()


@user_routes.route("/favorites")
@login_required
def likedSongs():
    """
    Query for current user favorites
    """
    user = User.query.get(current_user.id)
    return user.Serialize_favorites()


@user_routes.route("/favorites/add", methods=["POST"])
@login_required
def likeSong():
    """
    Query for current user then add song to favorites
    """
    print("THE REQUEST OBJECT IS", request.json["songId"])
    user = User.query.get(current_user.id)
    song = Song.query.get(request.json["songId"])

    print(song, "the SONG FROM REQUEST")
    user.favorites.append(song)
    return user.Serialize_favorites()
