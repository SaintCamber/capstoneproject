from flask import Blueprint, jsonify
from flask_login import current_user, login_required
from fuzzywuzzy import fuzz
from sqlalchemy import or_

from app.models import Album, Artist, Song

search_routes = Blueprint("search_routes", __name__)


@search_routes.route("/<string:query>")
@login_required
def search_catalog(query):
    try:
        # Perform a fuzzy search for artists, songs, and albums
        Artists = Artist.query.filter(Artist.name.ilike(f"%{query}%")).all()
        Songs = Song.query.filter(Song.title.ilike(f"%{query}%")).all()
        Albums = Album.query.filter(Album.name.ilike(f"%{query}%")).all()

        print(Artists, Songs, Albums)

        # Fuzzy search results
        fuzzy_artists = [
            artist for artist in Artists if fuzz.partial_ratio(query, artist.name) >= 80
        ]
        fuzzy_songs = [
            song for song in Songs if fuzz.partial_ratio(query, song.title) >= 80
        ]
        fuzzy_albums = [
            album for album in Albums if fuzz.partial_ratio(query, album.name) >= 80
        ]

        results = {
            "artists": [artist.to_dict() for artist in fuzzy_artists],
            "songs": [song.to_dict() for song in fuzzy_songs],
            "albums": [album.to_dict() for album in fuzzy_albums],
        }

        return jsonify(results)
    except Exception as e:
        print(e)
        return jsonify({"error": 404})
