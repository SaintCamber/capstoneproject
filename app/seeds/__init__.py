from flask.cli import AppGroup
from .users import seed_users, undo_users
from .seedcmds import create_albums,create_artists,create_songs,create_playlists,undo_seeds
from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
    seed_users()
    create_artists(5)
    create_albums(10)
    create_songs(30)
    create_playlists(5)
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_seeds()
    # Add other undo functions here