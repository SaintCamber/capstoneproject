"""empty message

Revision ID: 86467f72f60e
Revises: 6772b198107a
Create Date: 2023-03-24 14:11:49.936693

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "86467f72f60e"
down_revision = "6772b198107a"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "artists",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name"),
    )
    op.create_table(
        "albums",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("artist_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("release_date", sa.DateTime(), nullable=False),
        sa.Column("album_art", sa.String(length=255), nullable=True),
        sa.ForeignKeyConstraint(
            ["artist_id"],
            ["artists.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "playlists",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "songs",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("file_url", sa.String(length=255), nullable=False),
        sa.Column("artist_id", sa.Integer(), nullable=True),
        sa.Column("album_id", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(
            ["album_id"],
            ["albums.id"],
        ),
        sa.ForeignKeyConstraint(
            ["artist_id"],
            ["artists.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "playlistsongs",
        sa.Column("songs.id", sa.Integer(), nullable=False),
        sa.Column("playlists.id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["playlists.id"],
            ["playlists.id"],
        ),
        sa.ForeignKeyConstraint(
            ["songs.id"],
            ["songs.id"],
        ),
        sa.PrimaryKeyConstraint("songs.id", "playlists.id"),
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("playlistsongs")
    op.drop_table("songs")
    op.drop_table("playlists")
    op.drop_table("albums")
    op.drop_table("artists")
    # ### end Alembic commands ###
