import os
import subprocess
from app.models import db, Song, Artist, Album, Playlist, playlists_songs, User
from app.models.db import environment, SCHEMA, db
from sqlalchemy.sql import text
from faker import Faker
import random

fake = Faker()
BUCKET_NAME = os.environ.get("bucket_name")
ALLOWED_EXTENSIONS = {"mp3", "wav", "flac", "m4p"}


def parse_filename(filename):
    artist_album_song_hash = filename.split("_")
    artist = artist_album_song_hash[0].replace("-", " ")
    album = artist_album_song_hash[1].replace("-", " ")
    song = artist_album_song_hash[2].replace("-", " ")
    return artist, album, song


def seeds():
    # List all the files in the bucket
    # Parse the files in the bucket and create a song entry for each
    files = [
        "Adele_21_01-Rolling-in-the-Deep_c438d222-1f10-4987-bb25-0e0b453f50c0.m4p",
        "Adele_25_01-Hello_ab56c62e-4451-400b-b4d5-c1866581585a.m4p",
        "AFI_DECEMBERUNDERGROUND_03-Miss-Murder_a2b45557-dcd1-4b3a-8aa9-1d6efed17d6e.m4p",
        "AFI_Decemberunderground-Bonus-Track-Version_03-Miss-Murder_e8400135-31a6-4dba-9809-d8db2b5c554a.m4p",
        "Alanis-Morissette_Jagged-Little-Pill-Remastered_02-You-Oughta-Know_bff90a04-c513-4a3a-a353-c44e0669b33a.m4p",
        "Alanis-Morissette_Jagged-Little-Pill-Remastered_04-Hand-In-My-Pocket_552a5436-f53b-4f43-8264-1e65317d757d.m4p",
        "Alanis-Morissette_Jagged-Little-Pill-Remastered_10-Ironic_99f18379-6283-40ac-80ed-c8ebd895f1c1.m4p",
        "Alice-Cooper_Along-Came-a-Spider_02-Vengeance-Is-Mine_1ff79527-98c8-419e-b82c-d04badcf1455.m4p",
        "Alice-Cooper_Along-Came-a-Spider_05-In-Touch-With-Your-Feminine-Sid_28f5889d-3fa4-46a0-b515-39321ea150ed.m4p",
        "Alicia-Keys_The-Diary-of-Alicia-Keys_06-If-I-Aint-Got-You_8ce39251-c455-42f9-8866-73b41a0eea98.m4p",
        "Amy-Winehouse_Rehab-Remixes--B-Sides---EP_04-Rehab-Pharoahe-Monch-Remix_b695da5d-63b0-4f2d-a79f-96adfe90d7b3.m4p",
        "Ashlee-Simpson_Autobiography_02-Pieces-of-Me_146f233c-0521-4e95-8fce-8cadf4b96154.m4p",
        "Avenged-Sevenfold_Avenged-Sevenfold-Bonus-Track-Version_02-Almost-Easy_c3dd4d8d-16e9-4be8-9d37-299ce5685498.m4p",
        "Avenged-Sevenfold_Avenged-Sevenfold-Bonus-Track-Version_04-Afterlife_9238f696-ae70-49ad-80f7-9f420af12238.m4p",
        "Avenged-Sevenfold_Avenged-Sevenfold-Bonus-Track-Version_09-A-Little-Piece-of-Heaven_2ad81bc4-00e5-428f-bf26-cd232998e280.m4p",
        "Avenged-Sevenfold_City-of-Evil_01-Beast-and-the-Harlot_5e6ff295-6dc9-4740-a1cd-89c1a4d4f46e.m4p",
        "Avenged-Sevenfold_City-of-Evil_04-Bat-Country_69b6d172-ad29-4acb-b1e3-d84ea1d2d4c9.m4p",
        "Avenged-Sevenfold_Hail-to-the-King-Deluxe-Edition_02-Hail-to-the-King_82a2f4ae-9774-4464-9e64-b7da7379474a.m4p",
        "Avenged-Sevenfold_Nightmare-Deluxe-Edition_01-Nightmare_3465c8fa-27db-4f80-80fc-27087cdf4cae.m4p",
        "Avril-Lavigne_Avril-Lavigne-Expanded-Edition_02-Heres-to-Never-Growing-Up_7cec8629-463e-4a65-afef-21df51431cdc.m4p",
        "Avril-Lavigne_Girlfriend-EP_02-Girlfriend_55e1fa81-441e-4fc7-90e3-963d912980af.m4p",
        "Avril-Lavigne_Goodbye-Lullaby-Expanded-Edition_02-What-the-Hell_fbfc5ae3-b09a-4b35-8216-986ab69b83fc.m4p",
        "Avril-Lavigne_Let-Go_02-Complicated_16694c0b-848f-4f12-a043-d2d4913b16f9.m4p",
        "Avril-Lavigne_Let-Go_03-Sk8er-Boi_00b1365b-c832-46f1-aa06-64da0ae5ab19.m4p",
        "Avril-Lavigne_Let-Go_04-Im-with-You_1a4b2501-3b74-4597-9dc2-04f61980603d.m4p",
        "Avril-Lavigne_The-Best-Damn-Thing-Expanded-Edition_05-When-Youre-Gone_3a123ca0-fd52-4027-8193-57fc3f503d48.m4p",
        "Avril-Lavigne_The-Best-Damn-Thing-Expanded-Edition_12-Keep-Holding-On_d6cd1c7b-463f-44e1-b810-8ef990588d0a.m4p",
        "Avril-Lavigne_Under-My-Skin_06-My-Happy-Ending_a09e49a8-5160-4da8-ac2d-5a06ed22d89e.m4p",
        "Classified_Classified_02-3-Foot-Tall_5c7b4b9f-8307-4925-9062-ad7dc3d6a71e.m4p",
        "Eminem_Killshot---Single_01-Killshot_72d07381-d674-4ff2-9abd-b276a1238c74.m4p",
        "Epic-Rap-Battles-of-History_Darth-Vader-vs-Adolf-Hitler-feat.-Nice_01-Darth-Vader-vs-Adolf-Hitler-feat_dd457519-1ef0-4289-8612-c0402721892e.m4p",
        "JAY-Z--LINKIN-PARK_Collision-Course-Bonus-Video-Version--_01-Dirt-Off-Your-Shoulder-_-Lying-fr_565e4595-1084-44cd-94d2-4ed7d14a0599.m4p",
        "JAY-Z--LINKIN-PARK_Collision-Course---EP_01-Dirt-Off-Your-Shoulder-_-Lying-fr_87c93f2c-9367-4a5f-a5cb-147bab601151.m4p",
        "JAY-Z--LINKIN-PARK_Collision-Course---EP_02-Big-Pimpin-_-Papercut_7b58f271-a1e1-4fc3-be77-dbd6fddd385a.m4p",
        "JAY-Z--LINKIN-PARK_Collision-Course---EP_03-Jigga-What-_-Faint_8d8b8ce4-f9d1-4138-a5be-0bc43384fbc8.m4p",
        "JAY-Z--LINKIN-PARK_Collision-Course---EP_04-Numb-_-Encore_a542177b-03c6-4887-a8d1-9ed28141abb2.m4p",
        "JAY-Z--LINKIN-PARK_Collision-Course---EP_05-Izzo-_-In-the-End_9c0e9643-3e9d-4553-9b47-a298fb0d8296.m4p",
        "JAY-Z--LINKIN-PARK_Collision-Course---EP_06-Points-of-Authority-_-99-Problems_45cce885-5789-4cfa-9cf7-99ce06b08d63.m4p",
        "LINKIN-PARK_A-Thousand-Suns-Deluxe-Edition_03-Burning-In-the-Skies_8f92892d-1dc4-4ead-820a-3b6f8b6188ef.m4p",
        "LINKIN-PARK_A-Thousand-Suns-Deluxe-Edition_12-Iridescent_3b5d8003-a5b4-435b-82fa-215f29a54a8a.m4p",
        "LINKIN-PARK_Hybrid-Theory-Deluxe-Edition_01-Papercut_b3fbf0c5-b158-4179-8073-60ca46d744d8.m4p",
        "LINKIN-PARK_Hybrid-Theory-Deluxe-Edition_02-One-Step-Closer_426c6914-a1e2-42b1-81c3-4798cad0d6e5.m4p",
        "LINKIN-PARK_Hybrid-Theory-Deluxe-Edition_03-With-You_fc36d8f8-5d9b-4a01-b5c7-edee2fcc30bc.m4p",
        "LINKIN-PARK_Hybrid-Theory-Deluxe-Edition_04-Points-of-Authority_47d2a242-efb5-4706-9cb8-7c7660de852e.m4p",
        "LINKIN-PARK_Hybrid-Theory-Deluxe-Edition_05-Crawling_f09502f8-5a97-43f6-873d-f69b4c620c25.m4p",
        "LINKIN-PARK_Hybrid-Theory-Deluxe-Edition_06-Runaway_99c88599-adec-4c10-b6ff-04523a2a0240.m4p",
        "LINKIN-PARK_Hybrid-Theory-Deluxe-Edition_07-By-Myself_4dbf087f-0993-4659-a1d6-f889a2966ca8.m4p",
        "LINKIN-PARK_Hybrid-Theory-Deluxe-Edition_08-In-the-End_4689bf2b-d148-4889-86f6-8e7f5117702d.m4p",
        "LINKIN-PARK_Hybrid-Theory-Deluxe-Edition_09-A-Place-for-My-Head_85d85db3-6079-45e0-80ce-fa69ebd91d45.m4p",
        "LINKIN-PARK_Hybrid-Theory-Deluxe-Edition_10-Forgotten_53215c12-8f7b-4786-a6fe-ccb800c30406.m4p",
        "LINKIN-PARK_Hybrid-Theory-Deluxe-Edition_11-Cure-for-the-Itch_6558c3d2-bc40-4435-a1d4-ab5152a0f6b8.m4p",
        "LINKIN-PARK_Hybrid-Theory-Deluxe-Edition_12-Pushing-Me-Away_729f5568-c65c-4b9f-ba52-90049f8785d4.m4p",
        "LINKIN-PARK_Hybrid-Theory-Deluxe-Edition_15-Pts.Of.Athrty-The-Crystal-Method_14c425c4-7a1c-4518-815b-812fc5131b54.m4p",
        "LINKIN-PARK_LIVING-THINGS_12-POWERLESS_80d5c25b-6fa7-45e7-90b5-dd81b4ff7321.m4p",
        "LINKIN-PARK_Meteora-Deluxe-Edition_01-Foreword_89a9642e-2187-4156-bad2-22191e3e79d2.m4p",
        "LINKIN-PARK_Meteora-Deluxe-Edition_02-Dont-Stay_c3f49a26-9fe8-4f12-9807-6ec35ba04b73.m4p",
        "LINKIN-PARK_Meteora-Deluxe-Edition_03-Somewhere-I-Belong_4187e23c-aeb5-499a-a4a5-36ec89c9e198.m4p",
        "LINKIN-PARK_Meteora-Deluxe-Edition_04-Lying-from-You_f5fff448-80d2-4208-8136-3897e85956f2.m4p",
        "LINKIN-PARK_Meteora-Deluxe-Edition_05-Hit-the-Floor_ce843ebb-6264-4537-86ca-bdff62052cc7.m4p",
        "LINKIN-PARK_Meteora-Deluxe-Edition_06-Easier-to-Run_27bd3a05-deec-4869-a84d-23471c3dc1a6.m4p",
        "LINKIN-PARK_Meteora-Deluxe-Edition_07-Faint_25e3f2bb-81d0-495e-8954-c2bcdcc7a712.m4p",
        "LINKIN-PARK_Meteora-Deluxe-Edition_08-Figure.09_1f638583-c8f2-4215-8e7c-d8a1e5f6c8a9.m4p",
        "LINKIN-PARK_Meteora-Deluxe-Edition_09-Breaking-the-Habit_4c63376c-523e-43ef-bc6d-89344437dc7b.m4p",
        "LINKIN-PARK_Meteora-Deluxe-Edition_10-From-the-Inside_81cde71d-be59-4d80-bc7c-687c2ea49232.m4p",
        "LINKIN-PARK_Meteora-Deluxe-Edition_11-Nobodys-Listening_29cdff56-f69d-44a1-9f96-e5d4e1bda0b5.m4p",
        "LINKIN-PARK_Meteora-Deluxe-Edition_12-Session_a0b2c786-9621-41c3-882e-9367d1132f0f.m4p",
        "LINKIN-PARK_Meteora-Deluxe-Edition_13-Numb_6d1ca74d-b5dc-472a-8d0a-2d490452a999.m4p",
        "LINKIN-PARK_Minutes-to-Midnight-Deluxe-Edition_08-No-More-Sorrow_40b310d2-868c-4aa9-9a3c-8e65b3db6870.m4p",
        "LINKIN-PARK_Minutes-to-Midnight-Deluxe-Edition_12-The-Little-Things-Give-You-Away_34df3200-6df9-460e-8509-40975fb216b3.m4p",
        "LINKIN-PARK_Reanimation_01-Opening_e0d0484f-8def-448c-b5ef-3ca31a4887d2.m4p",
        "LINKIN-PARK_Reanimation_02-Pts.Of.Athrty_8f884318-c7dc-4a6e-91ab-8b46608c24d3.m4p",
        "LINKIN-PARK_Reanimation_03-Enth-E-Nd_316211c3-ffec-44c7-9fa8-25b7ee900d83.m4p",
        "LINKIN-PARK_Reanimation_04-Chali_2d298e15-2aa2-4ace-88ae-d45acacd9acf.m4p",
        "LINKIN-PARK_Reanimation_05-Frgt_10_6d73df13-973a-4c3d-94ee-1d0f5350c33f.m4p",
        "LINKIN-PARK_Reanimation_06-P5hng-Me-A_wy_a9603132-4f6c-42d5-907a-47bb53ecd64e.m4p",
        "LINKIN-PARK_Reanimation_07-Plc.4-Mie-Hæd_b5428ebd-fd01-495a-b46c-25f80f9dbd91.m4p",
        "LINKIN-PARK_Reanimation_08-X-Ecutioner-Style_c9be5832-1b1b-483f-8afc-a41ae4826049.m4p",
        "LINKIN-PARK_Reanimation_09-H-Vltg3_e5f5b5ce-dda0-4d9b-bb29-419a6fff431b.m4p",
        "LINKIN-PARK_Reanimation_10-Riff-Raff_f0ce4412-a309-42e2-88ff-b0c006e7e500.m4p",
        "LINKIN-PARK_Reanimation_11-Wth_You_b8b82480-3775-4d8d-ae64-f080325d62cf.m4p",
        "LINKIN-PARK_Reanimation_12-Ntr_Mssion_6723aa77-8367-48eb-b8bf-183c84c7cd89.m4p",
        "LINKIN-PARK_Reanimation_13-Ppr_Kut_8a2301a5-d753-4ad0-a03f-1cc375a07ca8.m4p",
        "LINKIN-PARK_Reanimation_14-Rnwy_c45339fd-99be-44d4-b6f7-7bbbe35c5df4.m4p",
        "LINKIN-PARK_Reanimation_15-My_Dsmbr_89a905de-ab59-42d2-8c9f-232a53e3612f.m4p",
        "LINKIN-PARK_Reanimation_16-Stef_c7423de7-38a0-4420-a98c-b71a36513d72.m4p",
        "LINKIN-PARK_Reanimation_17-By_Myslf_0477ced4-532f-434c-a5bd-3f6b50526b9c.m4p",
        "LINKIN-PARK_Reanimation_18-Kyur4-th-Ich_f3f84b57-3465-4482-b12f-02b0ea57132c.m4p",
        "LINKIN-PARK_Reanimation_19-1Stp-Klosr_a1be6f32-e38c-4988-9845-8f0b16b3f006.m4p",
        "LINKIN-PARK_Reanimation_20-Krwlng_c28190cb-6c64-4eee-b82f-ea558a08c60c.m4p",
        "LINKIN-PARK_The-Hunting-Party_02-All-for-Nothing-feat.-Page-Hamil_620cafc0-4658-48c9-901a-28126be10a64.m4p",
        "LINKIN-PARK_The-Hunting-Party_08-Rebellion-feat.-Daron-Malakian_ca854040-2c2a-4ccd-83de-f2be71183fce.m4p",
        "LINKIN-PARK_The-Hunting-Party_11-Final-Masquerade_758cbf57-7d19-48dc-b91d-4fee75e12673.m4p",
        "The-All-American-Rejects_Move-Along_03-Move-Along_15eb54f9-8518-4ada-a8a2-1a4479b37d97.m4p",
        "The-All-American-Rejects_When-the-World-Comes-Down-Deluxe-Editio_04-Gives-You-Hell_c985a488-b62d-496d-b2e7-d9dacdc72248.m4p",
        "The-Beatles_Abbey-Road_01-Come-Together_bb093926-9f15-4f63-bf26-e4728de578de.m4p",
        "The-Beatles_Abbey-Road_07-Here-Comes-the-Sun_cd7fa7da-f11b-4f2d-8461-404202c62b4d.m4p",
        "The-Beatles_Let-It-Be_06-Let-It-Be_2ab86483-71a5-4758-b9f8-56a71cd24f89.m4p",
        "The-Beatles_Revolver_02-Eleanor-Rigby_fb2ebe11-b02e-4d03-8e0d-bf161c13f0b7.m4p",
        "TOOL_Undertow_03-Sober_1e75c569-1b5e-4a1e-938d-b91f2c19e696.m4p",
    ]

    for file in files:
        # Extract the song information from the file name
        artist_name, album_name, song_title = parse_filename(file)
        # Create or retrieve the artist
        artist = Artist.query.filter_by(name=artist_name).first()
        if not artist:
            artist = Artist(name=artist_name)
            db.session.add(artist)

        # Create or retrieve the album
        album = Album.query.filter_by(name=album_name, artist=artist).first()
        if not album:
            album = Album(name=album_name, artist=artist)
            db.session.add(album)

        file_url = f"https://f005.backblazeb2.com/file/capstonestorage/{file}"
        song = Song.query.filter_by(title=song_title, file_url=file_url).first()
        if song:
            continue
        # Create the song entry
        song = Song(
            title=song_title,
            file_url=file_url,
            artist=artist,
            album=album,
        )
        db.session.add(song)

    # Commit the changes to the database
    db.session.commit()


def seed_playlists():
    users = User.query.all()
    songs = Song.query.all()
    for user in users:
        playlist = Playlist(user=user, name=fake.word())
        db.session.add(playlist)
        song_set = set()  # keep track of songs already added to playlist
        for song in songs:
            if song not in song_set:  # only add song if it hasn't already been added
                playlist.songs.append(song)
                song_set.add(song)

    db.session.commit()


def undo_seeds():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.playlists RESTART IDENTITY CASCADE;"
        ),
        db.session.execute(f"TRUNCATE table {SCHEMA}.songs RESTART IDENTITY CASCADE;"),
        db.session.execute(f"TRUNCATE table {SCHEMA}.albums RESTART IDENTITY CASCADE;"),
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.artists RESTART IDENTITY CASCADE;"
        ),
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
