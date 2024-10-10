import os
import random

import psycopg2
# from faker import Faker
from sqlalchemy.sql import text

from app.models import Album, Artist, Playlist, Song, User, db
from app.models.db import SCHEMA, environment

# fake = Faker()
BUCKET_NAME = os.environ.get("bucket_name")
ALLOWED_EXTENSIONS = {"mp3", "wav", "flac", "m4p"}


def parse_filename(filename):
    artist_album_song_hash = filename.split("_")
    artist = artist_album_song_hash[0].replace("-", " ").lower()
    album = artist_album_song_hash[1].replace("-", " ").lower()
    song = artist_album_song_hash[2].replace("-", " ").lower()
    return artist, album, song


def seeds():
    # List all the files in the bucket
    # Parse the files in the bucket and create a song entry for each
    files = [
        "3-Doors-Down_3-Doors-Down_3-Its-Not-My-Time_c3afe4e8-858c-4457-b597-e927e688ba83.mp3",
        "3-Doors-Down_Away-From-The-Sun_6-Here-Without-You_249c5738-ef90-44ca-9cae-69618213c2cd.mp3",
        "3-Doors-Down_The-Better-Life_1-Kryptonite_c513195d-0f58-4b34-927f-18d9d0e94cbb.mp3",
        "3-Doors-Down_The-Better-Life_5-Be-Like-That_627eabba-cf1c-43f2-b9eb-31c19ee3139e.mp3",
        "Aerosmith_Aerosmith_3-Dream-On_81623d3c-c218-4bd2-accc-da277e273519.mp3",
        "Aerosmith_I-Dont-Want-To-Miss-A-Thing_1-I-Dont-Want-to-Miss-a-Thing---From-the-Touchstone-film-Armageddon_9fd86213-be05-4b5c-b7dd-59f515aacb33.mp3",
        "Aerosmith_Toys-In-The-Attic_6-Sweet-Emotion_f1a796b9-ec15-43eb-a2fc-197d0868d786.mp3",
        "Afroman_The-Good-Times_11-Because-I-Got-High_b1a2ba4a-8b22-4f3f-ab1d-9d9b9f8ffd39.mp3",
        "Afroman_The-Good-Times_2-Crazy-Rap-Colt-45--2-Zig-Zags_1261d69b-2ca1-4887-9595-b766e1e15dac.mp3",
        "Afroman_The-Good-Times_3-She-Wont-Let-Me-Fuck_b42c179a-5df9-4ecd-8ed3-e8cf2e60901b.mp3",
        "Afroman_The-Good-Times_7-Tall-Cans_c4fc6e08-9a84-44b1-a1c2-722da6d56bff.mp3",
        "Alanis-Morissette_Jagged-Little-Pill-Collectors-Edition_7-You-Learn---2015-Remaster_0eb9ddd9-9086-4104-8e36-ec410be82628.mp3",
        "Alanis-Morissette_Jagged-Little-Pill-Collectors-Edition_8-Head-over-Feet---2015-Remaster_c6608723-b8d8-41f3-a796-0cd9a76b0a29.mp3",
        "Alanis-Morissette_Jagged-Little-Pill_10-Ironic_14e2d2e9-2e39-48dd-896a-b03543531c5d.mp3",
        "Alanis-Morissette_Jagged-Little-Pill_2-You-Oughta-Know_94af2c6a-358e-451e-b897-a57983c2f051.mp3",
        "Alanis-Morissette_Jagged-Little-Pill_4-Hand-in-My-Pocket_dbf3afb6-9070-4608-85b9-baf070db79ee.mp3",
        "AlessoKaty-Perry_When-Im-Gone-with-Katy-Perry_1-When-Im-Gone-with-Katy-Perry_f5421a8e-9d01-4bb9-b6bc-174094c87d0e.mp3",
        "AlokSigalaEllie-Goulding_All-By-Myself_1-All-By-Myself_d15a25d5-2f99-4f5a-869f-71494d434157.mp3",
        "Avril-Lavigne_Let-Go_2-Complicated_b94e9342-9877-47e7-8c80-0f4b5a087fd1.mp3",
        "Barenaked-Ladies_Maroon_3-Pinch-Me_c213c884-e39a-4b01-8f55-395bfedacd7c.mp3",
        "Barenaked-Ladies_Stunt_1-One-Week_3bebe269-3541-46af-b6e7-c301eb78e5dc.mp3",
        "Barenaked-Ladies_Stunt_2-Its-All-Been-Done_2df16665-786b-408c-8c43-aa307562743d.mp3",
        "Beck_Odelay_9-Where-Its-At_f4e3dd25-5650-488d-a600-18dd6de86ac3.mp3",
        "benny-blancoHalseyKhalid_FRIENDS-KEEP-SECRETS_1-Eastside-with-Halsey--Khalid_9847172d-d26a-4aae-9691-18c147210b8d.mp3",
        "blink-182_Enema-Of-The-State_5-Whats-My-Age-Again_250e0ede-ce3b-4363-bba3-f9842f02266a.mp3",
        "blink-182_Enema-Of-The-State_8-All-The-Small-Things_fb728b78-0c06-461a-aeed-29541a47fff7.mp3",
        "blink-182_Greatest-Hits-Explicit-Version_13-I-Miss-You_08937360-ea4f-4452-9749-d55ccd369918.mp3",
        "Blues-Traveler_Travelogue-Blues-Traveler-Classics_10-Run-Around_a7495045-a3ee-466e-9d99-261dcc0eeba7.mp3",
        "Blues-Traveler_Travelogue-Blues-Traveler-Classics_14-Hook_752531bd-6141-4f4c-8c1c-57f081fd62d9.mp3",
        "Britney-Spears_...Baby-One-More-Time-Digital-Deluxe-Version_1-...Baby-One-More-Time_ef58d7dd-e75e-418e-9037-be8608101a6b.mp3",
        "Britney-Spears_Blackout_1-Gimme-More_e4240952-cc5e-4b47-b584-ea1ad93ccea8.mp3",
        "Britney-Spears_In-The-Zone_6-Toxic_9aecc532-d078-428a-a7f5-8043015dcebd.mp3",
        "Britney-Spears_Oops...-I-Did-It-Again_1-Oops...I-Did-It-Again_eae055c0-c740-4493-9bf8-967cf0bfb2c6.mp3",
        "BTSHalsey_MAP-OF-THE-SOUL--PERSONA_2-Boy-With-Luv-feat.-Halsey_e924b561-7085-47c0-93d4-310f1101feb4.mp3",
        "Butthole-Surfers_Electriclarryland_3-Pepper_9bee31ab-f1f4-4558-9486-61138d5321ce.mp3",
        "Calvin-HarrisEllie-Goulding_Miracle-with-Ellie-Goulding_1-Miracle-with-Ellie-Goulding_d884109b-0b5b-419d-9b6b-2deb6c331f3b.mp3",
        "Calvin-HarrisEllie-Goulding_Motion_6-Outside-feat.-Ellie-Goulding_f3820dac-7df0-4679-a60f-bf18a3061b71.mp3",
        "Calvin-HarrisPharrell-WilliamsKaty-PerryBig-SeanFunk-Wav_Funk-Wav-Bounces-Vol.1_8-Feels-feat.-Pharrell-Williams-Katy-Perry--Big-Sean_60cd88fc-493e-4af3-9373-8b0c6512d3be.mp3",
        "Christina-Aguilera_Christina-Aguilera_1-Genie-in-a-Bottle_5514adc5-c41a-47cd-9f97-dbf2aee854c5.mp3",
        "Christina-Aguilera_Christina-Aguilera_2-What-a-Girl-Wants_454fcc96-2761-4128-97e0-7ec237094e99.mp3",
        "Chumbawamba_Tubthumper_1-Tubthumping_6f718cf8-254b-4814-9af9-4231fc8fd44e.mp3",
        "ColdplaySelena-Gomez_Music-Of-The-Spheres_5-Let-Somebody-Go_82db5ab1-8d55-4e42-ae4e-48de64ba4834.mp3",
        "Collective-Soul_Collective-Soul_5-December_59c9418c-40d5-4bc9-8b5c-058a2a2d3847.mp3",
        "Collective-Soul_Hints-Allegations--Things-Left-Unsaid_1-Shine_064244d6-b77e-4aea-893b-43116324d733.mp3",
        "CoolioL.V._Gangstas-Paradise_3-Gangstas-Paradise-feat.-L.V._3d9ca984-0acc-45ef-9919-287755c961ca.mp3",
        "Crazy-Town_The-Gift-Of-Game_6-Butterfly_3ee079fa-2fe9-4751-9be1-bafcf00e1345.mp3",
        "Creed_Human-Clay_8-With-Arms-Wide-Open_aee55cc8-6f57-449b-a644-74068fe424ea.mp3",
        "Creed_Human-Clay_9-Higher_10a44f0a-2460-46ad-a252-b823aced47e8.mp3",
        "Dave-Matthews-Band_Crash_3-Crash-into-Me_7328c82e-1694-4297-8a73-6521a36a6eb3.mp3",
        "Deep-Blue-Something_Home_2-Breakfast-At-Tiffanys_13f927f0-eb77-436b-9653-4bf088e4a032.mp3",
        "Del-Amitri_Twisted_7-Roll-To-Me_ab06ce24-fca9-464d-a58b-a2c07ba6ed33.mp3",
        "Destinys-Child_The-Writings-On-The-Wall_12-Say-My-Name_8276ee04-3a5f-4408-b42f-17d3c007c986.mp3",
        "Duncan-Sheik_Duncan-Sheik_3-Barely-Breathing_869cb393-ca9a-4799-8816-d4fccdd4edfe.mp3",
        "Eagle-Eye-Cherry_Desireless_1-Save-Tonight_f98f8263-69b3-4e3a-a55e-4eef3286c9a7.mp3",
        "Edwin-McCain_Misguided-Roses_4-Ill-Be_807592c8-2b2d-4a60-8f39-12f3f3e7145e.mp3",
        "Ellie-Goulding_Delirium-Deluxe_9-Love-Me-Like-You-Do---From-Fifty-Shades-Of-Grey_9a7dd275-2345-4fd5-a23a-30d9fdf3e7be.mp3",
        "Eminem_Curtain-Call-The-Hits-Deluxe-Edition_11-The-Real-Slim-Shady_b19af690-005a-4310-9cc4-c06a61791dc9.mp3",
        "Eminem_Curtain-Call-The-Hits-Deluxe-Edition_12-Mockingbird_4c78937a-9864-4c92-b3a2-134b3541c76d.mp3",
        "Eminem_Curtain-Call-The-Hits-Deluxe-Edition_4-My-Name-Is_91aa4c6e-0260-40c2-8c09-ae8dce35ac93.mp3",
        "Eminem_Curtain-Call-The-Hits-Deluxe-Edition_6-Lose-Yourself---From-8-Mile-Soundtrack_16aeaac7-61b5-4bd1-b81b-9be47597f01b.mp3",
        "Eminem_Curtain-Call-The-Hits-Deluxe-Edition_8-Sing-For-The-Moment_545f0627-a308-4ead-b42b-1183033d4d1b.mp3",
        "Eve-6_Eve-6_2-Inside-Out_c4c6e2af-5718-4eff-b833-eb3f8b9e391f.mp3",
        "EveGwen-Stefani_Scorpion_4-Let-Me-Blow-Ya-Mind_fa4be0c1-1bb7-4fd0-ac52-3480911039c9.mp3",
        "Everlast_Whitey-Ford-Sings-The-Blues_4-What-Its-Like_137f26df-5ef2-42e9-a80c-ea5097537991.mp3",
        "Fastball_All-The-Pain-Money-Can-Buy_1-The-Way_6aae1d67-f25f-44b9-bfc8-2e71233c351c.mp3",
        "Five-For-Fighting_America-Town_3-Superman-Its-Not-Easy_0b5f3e3c-1384-4b5a-9be5-debc2eaac253.mp3",
        "FugeesMs.-Lauryn-Hill_The-Score-Expanded-Edition_8-Killing-Me-Softly-With-His-Song_3b4592b5-c16a-47c1-91b5-96fa5b755b6e.mp3",
        "G-EazyHalsey_The-Beautiful--Damned_3-Him--I-with-Halsey_0aa04277-c666-40c6-80e4-bc19e778b6d6.mp3",
        "Gin-Blossoms_Follow-You-Down_1-Follow-You-Down_7a27140f-6ca5-4fdc-b92c-e14d2bb0b814.mp3",
        "Gin-Blossoms_Follow-You-Down_2-Til-I-Hear-It-From-You_1a906762-86c7-41aa-abad-d350b0526672.mp3",
        "Gorillaz_Demon-Days_12-DARE_df371630-4c59-4685-89e0-287ec05f4f3f.mp3",
        "Gorillaz_Gorillaz_1-Re-Hash_9ced041b-5832-46d4-bc4b-96ec8a65c52d.mp3",
        "Gorillaz_Gorillaz_5-Clint-Eastwood_2c09df24-d43c-4594-b94c-bc80c0ca9c63.mp3",
        "Gorillaz_Plastic-Beach_10-On-Melancholy-Hill_ce9fc11f-283e-4899-860b-0619f4269206.mp3",
        "Green-Day_Dookie_10-When-I-Come-Around_5b842603-4384-4cf2-86b1-54d604137323.mp3",
        "Green-Day_Dookie_7-Basket-Case_f0bdc751-c94a-475b-9817-eec1d0441690.mp3",
        "Green-Day_Nimrod_17-Good-Riddance-Time-of-Your-Life_b8747c46-1aeb-49ba-8f9d-086d8214b6f6.mp3",
        "Halsey_Die-4-Me_1-Die-4-Me_0e5cda9f-314a-4298-bbf4-81f397a0e1c3.mp3",
        "Halsey_Manic_9-Without-Me_25e76f82-af5f-4779-aa54-2ebf75ec7707.mp3",
        "Harold-FaltermeyerLady-GagaHans-ZimmerLorne-Balfe_Top-Gun-Maverick-Music-From-The-Motion-Picture_12-Top-Gun-Anthem_28b061c1-0e69-48bc-b935-818de647c363.mp3",
        "Harvey-Danger_Where-Have-All-The-Merrymakers-Gone_2-Flagpole-Sitta_0fe4404c-58f4-45d7-8c19-26ae2e7c029d.mp3",
        "Incubus_Light-Grenades_4-Anna-Molly_246d27cb-2c27-4cad-be5a-b459f8dcb842.mp3",
        "Incubus_Make-Yourself_8-Drive_b6fd5c7e-f06c-4db9-95be-2ce2869c6463.mp3",
        "Joel-CorryJax-JonesCharli-XCXSaweetie_OUT-OUT-feat.-Charli-XCX--Saweetie_1-OUT-OUT-feat.-Charli-XCX--Saweetie_f032469b-0837-457a-99f3-1ce9015b758d.mp3",
        "Katy-Perry_PRISM_1-Roar_3a4d2511-e324-48a8-a181-cd02fbc80f40.mp3",
        "Kid-RockSheryl-Crow_Cocky_9-Picture-feat.-Sheryl-Crow_474838aa-fa1c-4d36-acf6-21c6aa0a5e7f.mp3",
        "Lady-GagaAndrelli_Million-Reasons-Andrelli-Remix_1-Million-Reasons---Andrelli-Remix_1ff30446-7c10-47d8-a3e8-dde6ea1abc29.mp3",
        "Lady-GagaAriana-Grande_Chromatica_4-Rain-On-Me-with-Ariana-Grande_3603cdd5-2e15-4052-a70a-41a29b5f4ab7.mp3",
        "Lady-GagaBradley-Cooper_A-Star-Is-Born-Soundtrack_12-Shallow_de3b79f8-5124-4b8c-8025-3fd4c46fba5f.mp3",
        "Lady-GagaColby-ODonis_The-Fame_1-Just-Dance_519121d2-11bd-4cba-afc3-3f47021638ff.mp3",
        "Lady-GagaLSDXOXO_Dawn-Of-Chromatica_1-Alice---LSDXOXO-Remix_2bdd86e6-7655-458c-b39f-7965b235dba2.mp3",
        "Lady-Gaga_A-Star-Is-Born-Soundtrack-Without-Dialogue_9-Always-Remember-Us-This-Way_7b7e6370-6992-4ff4-8c92-066d895150ea.mp3",
        "Lady-Gaga_A-Star-Is-Born-Soundtrack_34-Ill-Never-Love-Again---Extended-Version_70d39c9f-a5fd-4660-8518-72fad67e60e4.mp3",
        "Lady-Gaga_A-Star-Is-Born-Soundtrack_5-La-Vie-En-Rose_a5fd7108-9cd6-465f-b3c5-a859a6c35c2b.mp3",
        "Lady-Gaga_ARTPOP_14-Applause_c113f793-1e79-41b2-b8c5-c02691c2c530.mp3",
        "Lady-Gaga_Born-This-Way-Special-Edition_10-Bad-Kids_ffcffa3b-e8a4-4e36-a837-b7c18b9953b7.mp3",
        "Lady-Gaga_Born-This-Way-Special-Edition_2-Born-This-Way_fc169bea-0474-4c05-8421-b7f84cfba512.mp3",
        "Lady-Gaga_Born-This-Way-Special-Edition_5-Americano_b2fcdf38-c86c-46c4-a6c1-cdce0956ae3c.mp3",
        "Lady-Gaga_Born-This-Way-Special-Edition_8-Bloody-Mary_8bb83a2e-51a2-4fa5-9a1d-85b00ebcba57.mp3",
        "Lady-Gaga_Chromatica_15-1000-Doves_1f751a98-3b74-46b0-9200-e83e9efd6067.mp3",
        "Lady-Gaga_Chromatica_5-Free-Woman_2e6030d9-e3de-4537-bf4b-6116183f1152.mp3",
        "Lady-Gaga_Joanne-Deluxe_1-Diamond-Heart_71670147-e941-4667-99dc-16542f132c42.mp3",
        "Lady-Gaga_Joanne-Deluxe_6-Perfect-Illusion_6320b710-8492-4039-8376-38e1d09e2501.mp3",
        "Lady-Gaga_Joanne-Deluxe_7-Million-Reasons_cf3bc5fc-3b58-4fd9-bec7-dbeb31c8de5e.mp3",
        "Lady-Gaga_The-Fame-Monster-Deluxe-Edition_1-Bad-Romance_0d6b23ea-3f9a-48ec-96cf-88f8c2b93378.mp3",
        "Lady-Gaga_The-Fame_2-LoveGame_cc8a4db1-a91f-48fd-a180-cfdefbfb6b63.mp3",
        "Lady-Gaga_The-Fame_4-Poker-Face_cc4b5dd4-2397-4df3-9495-7a4bb342ef02.mp3",
        "Lifehouse_No-Name-Face_1-Hanging-By-A-Moment_246cb214-b954-421f-b5a6-d5a47cc2425f.mp3",
        "Lou-Bega_A-Little-Bit-Of-Mambo_1-Mambo-No.-5-A-Little-Bit-of..._1e87d0ff-620f-4b3a-88bf-ebb50a839a37.mp3",
        "Marcy-Playground_Marcy-Playground_2-Sex--Candy_9e5d35de-405a-4355-89a2-f2f6ed5c232b.mp3",
        "Matchbox-Twenty_Exile-on-Mainstream_1-How-Far-Weve-Come_5e24bdfd-1f46-4afe-8378-feaf85939fd0.mp3",
        "Matchbox-Twenty_Exile-on-Mainstream_16-Unwell---2007-Remaster_2738d14b-9ed3-4d33-abf0-80060e754efe.mp3",
        "Matchbox-Twenty_The-Matchbox-Twenty-Collection_10-Bed-of-Lies_12312b50-d94a-4692-9a2d-c6e703b5cee9.mp3",
        "Matchbox-Twenty_The-Matchbox-Twenty-Collection_11-Youre-so-Real_25a4f26f-06fc-4a6a-a5dc-0adb44e50dd1.mp3",
        "Matchbox-Twenty_The-Matchbox-Twenty-Collection_2-Black--White-People_e43a16c8-a76e-47dd-9ab7-3a0b104091bd.mp3",
        "Matchbox-Twenty_The-Matchbox-Twenty-Collection_2-Disease_ced41c9d-0d08-43de-8b6c-1e5cd23a718c.mp3",
        "Matchbox-Twenty_The-Matchbox-Twenty-Collection_2-Long-Day_0de46374-4db0-4d9d-ab16-0bb074a37cb1.mp3",
        "Matchbox-Twenty_The-Matchbox-Twenty-Collection_3-Bright-Lights_20ad3342-aca4-426f-abad-be63d7879ff2.mp3",
        "Matchbox-Twenty_The-Matchbox-Twenty-Collection_3-Crutch_47ca9e3d-d864-45ef-b924-adba1e1e632d.mp3",
        "Matchbox-Twenty_The-Matchbox-Twenty-Collection_4-Last-Beautiful-Girl_6d0516ac-b913-4c89-909e-f50e94aecf57.mp3",
        "Matchbox-Twenty_The-Matchbox-Twenty-Collection_5-Girl-Like-That_581a6374-9b11-4bb5-8cb9-775cb755544d.mp3",
        "Matchbox-Twenty_The-Matchbox-Twenty-Collection_5-If-Youre-Gone_d05ce6c4-30eb-4f74-8638-f04da61ddfe3.mp3",
        "Matchbox-Twenty_The-Matchbox-Twenty-Collection_6-Mad-Season_dacb4825-4f2b-4db3-a211-027580731b16.mp3",
        "Matchbox-Twenty_The-Matchbox-Twenty-Collection_7-Damn_27db5d83-5929-45b8-ad76-88d3ec25a010.mp3",
        "Matchbox-Twenty_The-Matchbox-Twenty-Collection_8-The-Burn_a4f3341e-ff83-430d-8793-5e6956cc38fe.mp3",
        "Matchbox-Twenty_The-Matchbox-Twenty-Collection_9-Bent_702db5e0-36f9-48f8-92de-e0b749a1d099.mp3",
        "Matchbox-Twenty_Yourself-or-Someone-Like-You_1-Real-World_95914646-fea9-41fc-a45e-5fae9df01069.mp3",
        "Matchbox-Twenty_Yourself-or-Someone-Like-You_3-3AM_a84c1546-0862-497c-9dcd-0ea0a9f98ddd.mp3",
        "Matchbox-Twenty_Yourself-or-Someone-Like-You_4-Push_88503919-5c0e-45b4-8278-76a78f72daa1.mp3",
        "Meredith-Brooks_Blurring-The-Edges_2-Bitch_775f5478-f0fb-4eb7-87c8-875586f4daee.mp3",
        "Michelle-Branch_The-Spirit-Room_1-Everywhere_82e8363b-fe80-4478-b097-03b290e80088.mp3",
        "Michelle-Branch_The-Spirit-Room_3-All-You-Wanted_5116f220-04de-4b24-9919-06f9fb3feff1.mp3",
        "Natalie-Imbruglia_Left-Of-The-Middle_1-Torn_f1057299-ca04-427a-8c76-01117454b69e.mp3",
        "Nelly-Furtado_Whoa-Nelly_5-Im-Like-A-Bird_5f0c5d90-f5c2-4e86-9432-086a72d5f555.mp3",
        "New-Radicals_Maybe-Youve-Been-Brainwashed-Too_2-You-Get-What-You-Give_fcd877f2-9af1-41f5-a078-fba57206379b.mp3",
        "Nickelback_Silver-Side-Up_2-How-You-Remind-Me_2e9d3bd9-ca08-4f83-bd68-6265f9c9827f.mp3",
        "Nine-Days_The-Madding-Crowd_2-Absolutely-Story-of-a-Girl---Radio-Mix_8b30330c-dc7d-4437-bded-93fa99ad757c.mp3",
        "No-Doubt_The-Singles-Collection_13-Dont-Speak_602d8f02-e477-45d3-9d0a-2dabf0c579e0.mp3",
        "Oasis_Whats-The-Story-Morning-Glory-Deluxe-Edition-Remastered_12-Champagne-Supernova---Remastered_5f9c08bc-f283-4271-99c1-3d887b7acd8b.mp3",
        "Oasis_Whats-The-Story-Morning-Glory-Deluxe-Edition-Remastered_3-Wonderwall---Remastered_1e66ee0f-5010-4a93-a4d5-0444fe2d71d3.mp3",
        "Outkast_Stankonia_5-Ms.-Jackson_b1768ff3-936c-4fe5-8d5f-179108e41d12.mp3",
        "Paula-Cole_Rhino-Hi-Five-Paula-Cole_2-I-Dont-Want-to-Wait_ebf206eb-0977-4f2c-b675-f304936f5e4f.mp3",
        "PnkNate-Ruess_The-Truth-About-Love_4-Just-Give-Me-a-Reason-feat.-Nate-Ruess_a86d36e4-0419-4c52-b76b-403aa9bfcc81.mp3",
        "Pnk_Funhouse_1-So-What_eafdfbb2-69fa-4be1-ba68-e65b4fd0c2d7.mp3",
        "Pnk_Funhouse_2-Sober_69e1513e-0144-4205-9904-dc22d6524636.mp3",
        "Pnk_Greatest-Hits...So-Far_18-Fkin-Perfect_b246b8f2-b833-4354-bef1-c52e46696ca5.mp3",
        "Pnk_Im-Not-Dead_2-Who-Knew_2b82d522-4836-4312-90b0-9c6bd801a1e6.mp3",
        "Pnk_Im-Not-Dead_9-U--Ur-Hand_3cbfd59f-e4a5-4b0d-9d00-8a8a936cbb0c.mp3",
        "Pnk_Mssundaztood_4-Get-the-Party-Started_fe52bf3f-519f-4aea-be11-0a7010aaec82.mp3",
        "Pnk_Raise-Your-Glass_1-Raise-Your-Glass_04e97de1-fc08-4d1d-a2f2-86cca8d247ca.mp3",
        "Pnk_The-Truth-About-Love_2-Blow-Me-One-Last-Kiss_0e1393b8-ccfc-4835-a7e1-c4cc54103e35.mp3",
        "Pnk_The-Truth-About-Love_3-Try_4e17617a-a970-423c-99e7-2d8a44f4dcfc.mp3",
        "Pnk_TRUSTFALL_2-TRUSTFALL_0021191d-eae0-44c0-883b-c4c32e110af4.mp3",
        "R.-Kelly_R._13-I-Believe-I-Can-Fly_11cb8a6f-3da1-4544-96f2-70039a417374.mp3",
        "Red-Hot-Chili-Peppers_By-the-Way_1-By-the-Way_d2b9c721-a91c-4e5b-8668-0d0854694a4e.mp3",
        "Red-Hot-Chili-Peppers_Californication_1-Around-the-World_930080c3-aee2-49ab-b8dc-278140617401.mp3",
        "Red-Hot-Chili-Peppers_Californication_3-Scar-Tissue_feb8d504-150c-4bfe-aa16-0875cc4e1109.mp3",
        "Red-Hot-Chili-Peppers_Californication_6-Californication_6a7fb236-5929-49d4-b0c5-8cac334881e7.mp3",
        "Red-Hot-Chili-Peppers_Stadium-Arcadium_1-Dani-California_c7dcee45-55ed-4cc3-b1f3-c2bb675562d4.mp3",
        "Red-Hot-Chili-Peppers_Stadium-Arcadium_2-Snow-Hey-Oh_085f474f-ee31-4755-bc4d-d2f81544aad6.mp3",
        "RemaSelena-Gomez_Calm-Down-with-Selena-Gomez_1-Calm-Down-with-Selena-Gomez_d6463dfb-8d37-4624-b045-604bb4ea10b2.mp3",
        "SantanaRob-Thomas_Ultimate-Santana_3-Smooth-feat.-Rob-Thomas_d90cab12-606c-4113-855c-364de5d334f5.mp3",
        "Santana_Ultimate-Santana_6-Black-Magic-Woman_c18c2d83-a77b-4b22-bf85-8096fcd7dbdd.mp3",
        "Savage-Garden_Truly-Madly-Completely---The-Best-of-Savage-Garden_8-Truly-Madly-Deeply_73993aeb-bb01-4549-b240-aba26ba35a2f.mp3",
        "Seal_Seal_6-Kiss-from-a-Rose_a37638e8-cd86-4055-97c0-e3881cb6f6ac.mp3",
        "Selena-Gomez_Rare_4-Lose-You-To-Love-Me_a535dcd1-267c-4f74-83f1-87073edb2d2e.mp3",
        "Semisonic_20th-Century-Masters-The-Millennium-Collection-Best-Of-Semisonic_1-Closing-Time_b9758287-a2e9-45a3-af81-4fa333f85b9b.mp3",
        "ShaggyRik-Rok_Hot-Shot_10-It-Wasnt-Me_13ee8abc-4ad4-44bb-a75e-aea452a77316.mp3",
        "Sheryl-Crow_Everyday-Is-A-Winding-Road_1-Everyday-Is-A-Winding-Road_db24d453-1e06-4b4b-9f9c-7240c11f10e1.mp3",
        "Sheryl-Crow_If-It-Makes-You-Happy_1-If-It-Makes-You-Happy_64ab12a8-2f91-40a9-9512-b7713c005617.mp3",
        "Sister-Hazel_...Somewhere-More-Familiar_3-All-For-You_6b5f46e9-3750-4266-8a58-8c1aff346199.mp3",
        "Smash-Mouth_All-Star-Smash-Hits_16-Im-A-Believer---Radio-Edit_d34f5ba6-5174-4384-aed7-56232f8bfd2a.mp3",
        "Smash-Mouth_All-Star-Smash-Hits_2-Walkin-On-The-Sun_2c1fd652-5a4d-406e-80f8-84ae9177b748.mp3",
        "Smash-Mouth_Astro-Lounge_15-Cant-Get-Enough-Of-You-Baby_19ae5cbc-0d3e-4045-8814-c1ac492ddd47.mp3",
        "Smash-Mouth_Astro-Lounge_5-All-Star_f4234481-d9c3-4894-94c7-b8c3b904ec1a.mp3",
        "Smash-Mouth_Astro-Lounge_9-Then-The-Morning-Comes_ce074eb6-cfff-4d23-9dce-2a367bc5275f.mp3",
        "Spice-Girls_Spice_1-Wannabe_c75e1c27-0149-479f-ac33-ea596567b658.mp3",
        "Staind_The-Singles_5-Its-Been-Awhile_36a0f4e6-4fc4-4b8b-8e67-07a479631793.mp3",
        "Steve-Miller-Band_The-Joker_5-The-Joker_e4023458-f4cf-423a-9512-46147a7981f7.mp3",
        "Sublime_Sublime-Explicit-Version_17-Doin-Time---Uptown-Dub-Album-Version_db8e11b3-8c28-41ad-bd82-753dd4da4b68.mp3",
        "Sublime_Sublime-Explicit-Version_2-What-I-Got_0308c8ce-f8ff-4ce7-96b1-c9f5bc979d11.mp3",
        "Sublime_Sublime-Explicit-Version_3-Wrong-Way_fe94cab4-63f4-49d6-bca2-c5f4723e3563.mp3",
        "Sublime_Sublime-Explicit-Version_6-Santeria_7821628c-6071-4ca9-a3a5-9bd0d5457acb.mp3",
        "Sublime_Sublime-Explicit-Version_9-Pawn-Shop_327780ae-7c14-4fc3-ab22-358dbf581b9f.mp3",
        "Sugar-Ray_Floored_13-Fly_959aa946-3cc5-419b-b3ed-125695dc211f.mp3",
        "Sugar-Ray_The-Best-Of-Sugar-Ray_11-When-Its-Over---Remastered_b8990a97-799d-4070-9292-db3e1f2ee830.mp3",
        "Sugar-Ray_The-Best-Of-Sugar-Ray_4-Someday---Remastered_110f3bb3-2e80-4fba-968b-0dd6914ed780.mp3",
        "Sugar-Ray_The-Best-Of-Sugar-Ray_6-Every-Morning---Remastered_c55c0881-1cef-449b-a891-ca62ea15b9f1.mp3",
        "Sum-41_All-Killer-No-Filler_4-Fat-Lip_7d395769-207c-4403-8eaf-17027f0fb730.mp3",
        "Sum-41_All-Killer-No-Filler_7-In-Too-Deep_2d758f0b-251a-4bbe-a41e-39501db0df06.mp3",
        "The-Cardigans_Enron-The-Smartest-Guys-In-The-Room_6-Lovefool_c601f7ba-ec04-4d09-95d5-7d0b1ba4a8e6.mp3",
        "The-ChainsmokersHalsey_Closer_1-Closer_1f314b02-614f-4004-9058-0f314c20a9eb.mp3",
        "The-Goo-Goo-Dolls_A-Boy-Named-Goo_6-Name_35a0f906-c219-4a29-a9e1-c0ce7dc22102.mp3",
        "The-Goo-Goo-Dolls_Greatest-Hits-Volume-One---The-Singles_12-Black-Balloon_fcff8793-ae2f-4436-91fe-4d095fe3ae45.mp3",
        "The-Mighty-Mighty-Bosstones_Lets-Face-It_4-The-Impression-That-I-Get_ee633982-1924-4644-8229-fb41546b1fb0.mp3",
        "The-Notorious-B.I.G._Greatest-Hits_3-Hypnotize---2007-Remaster_c0609fb6-417f-4c53-8fa2-56ef2ada421b.mp3",
        "The-Rembrandts_Greatest-Hits_11-Ill-Be-There-for-You-Theme-from-Friends---Single-Version_1aa1d9aa-d27b-41c6-8201-5493b2ae05c9.mp3",
        "The-Smashing-Pumpkins_Mellon-Collie-And-The-Infinite-Sadness-Remastered_5-1979---Remastered-2012_28975498-d9f8-4ee0-a54e-d2d42d3b23b5.mp3",
        "The-Smashing-Pumpkins_Mellon-Collie-And-The-Infinite-Sadness-Remastered_6-Bullet-With-Butterfly-Wings---Remastered-2012_95e7dd98-2a60-473e-884a-a47f92ae50ad.mp3",
        "The-Verve-Pipe_Villains_7-The-Freshmen_09772910-185a-440e-be21-5f8e66d39391.mp3",
        "The-Verve_Urban-Hymns_1-Bitter-Sweet-Symphony_79abf3a0-742a-4b68-ad55-17df582b7bf6.mp3",
        "The-Wallflowers_Bringing-Down-The-Horse_1-One-Headlight_6a3cbc28-e34b-413d-a95f-b8ebff17364b.mp3",
        "Theory-of-a-Deadman_Scars--Souvenirs_8-Bad-Girlfriend_5ef0d767-5931-409a-9e5d-a8272476f29b.mp3",
        "Third-Eye-Blind_Blue_4-Never-Let-You-Go---2008-Remaster_73c543c5-e2b2-4cb3-8cd4-609d42186b25.mp3",
        "Third-Eye-Blind_Third-Eye-Blind_3-Semi-Charmed-Life_55b1a5ef-816d-4cc9-bb06-800b0db98c66.mp3",
        "Third-Eye-Blind_Third-Eye-Blind_4-Jumper---1998-Edit_b21add14-271a-413b-9c80-a3c06b01592f.mp3",
        "Third-Eye-Blind_Third-Eye-Blind_6-Hows-It-Going-to-Be_32fcf6bd-5d3f-4b9a-b4b6-d90bcc98b712.mp3",
        "TistoCharli-XCX_Hot-In-It_1-Hot-In-It_f70cbdbe-6a79-46c0-b43d-5b4a753fc72f.mp3",
        "TLC_Crazysexycool_2-Creep_3e9389ca-4a9e-4786-a2ed-c36785f3e342.mp3",
        "TLC_Crazysexycool_8-Waterfalls_6a4c971b-5abf-41f5-b9a8-d40ec9329fd4.mp3",
        "TLC_Fanmail_5-No-Scrubs_66b419f2-b7d8-4e12-9a01-050d112cd4d2.mp3",
        "Tom-Petty_Wildflowers_2-You-Dont-Know-How-It-Feels_cab7b310-da75-4813-90ce-5c014f35a725.mp3",
        "TOMORROW-X-TOGETHER_The-Name-Chapter-TEMPTATION_2-Sugar-Rush-Ride_fcc8c6de-d388-4c40-850b-dd1fd7bbad94.mp3",
        "Tonic_A-Casual-Affair---The-Best-Of-Tonic_3-If-You-Could-Only-See_068c246a-fc59-45ee-be33-8853c066b82e.mp3",
        "Tony-BennettLady-Gaga_Love-For-Sale-Deluxe_7-I-Get-A-Kick-Out-Of-You_9d71a73a-2299-4260-84c5-2822ff0280c1.mp3",
        "Tracy-Chapman_New-Beginning_9-Give-Me-One-Reason_03e45349-5688-4c3d-85b0-fc5f628f17d0.mp3",
        "Train_Drops-Of-Jupiter_3-Drops-of-Jupiter-Tell-Me_8c173d39-5293-4637-962c-bb56c5481eab.mp3",
        "Uncle-Kracker_Double-Wide_4-Follow-Me_176050e4-2516-4862-af19-af60cffbebf9.mp3",
        "Vertical-Horizon_Everything-You-Want_2-Youre-a-God_c40fff94-78a4-4992-be45-e21e8c66491a.mp3",
        "Vertical-Horizon_Everything-You-Want_3-Everything-You-Want_d2b40445-f53a-4dc1-8d69-16ba7266aeb8.mp3",
        "Vertical-Horizon_Everything-You-Want_4-Best-I-Ever-Had-Grey-Sky-Morning_2e31ce95-c469-45a2-aaff-4b7b9460ad6c.mp3",
        "Weezer_Make-Believe_1-Beverly-Hills_6ae23aa5-698d-484e-b6ae-c879af77b87c.mp3",
        "Weezer_Thank-God-for-Girls_1-Thank-God-for-Girls_90c6e76f-ed50-4d9c-abc0-532025007968.mp3",
        "Weezer_Weezer-Deluxe-Edition_14-Say-It-Aint-So_50084235-e210-43cf-a78a-4db9c0ad3391.mp3",
        "Weezer_Weezer-Deluxe-Edition_4-Buddy-Holly_54965fa2-e98c-4ab6-9d26-5ef1a6cae254.mp3",
        "Weezer_Weezer_1-Troublemaker_2f3e500b-a893-4989-a424-0a40a66645f2.mp3",
        "Weezer_Weezer_3-Hash-Pipe_2aa6e4a9-cd15-4c60-87bf-ba3ae83028bc.mp3",
        "Weezer_Weezer_3-Pork-And-Beans_69d57007-48e5-40f5-b638-513e0b24d767.mp3",
        "Weezer_Weezer_4-Island-In-The-Sun_d678d095-07b6-48a8-9975-02fe82c935ae.mp3",
        "Will-Smith_Big-Willie-Style_3-Gettin-Jiggy-Wit-It_7ed38ce1-b5bb-48b8-a4ee-1d292d03bc03.mp3",
        "Will-Smith_Big-Willie-Style_8-Miami_16b27160-8b85-41ad-8666-cf02576c6511.mp3",
        "Will-Smith_Just-The-Two-Of-Us_1-Just-the-Two-of-Us---Radio-Edit_a6b9790a-5b0e-4fe2-9806-9c269ec80af3.mp3",
        "will.i.amBritney-Spears_willpower_4-Scream--Shout_fd1d89c4-1c86-4a10-8f6a-c9660d2ccd9b.mp3",
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
        try:
            song = Song(
                title=song_title,
                file_url=file_url,
                artist=artist,
                album=album,
            )
            db.session.add(song)
            # Commit the changes to the database
            db.session.commit()

        except psycopg2.errors.UniqueViolation as e:
            # Handle the unique constraint violation error
            # Rollback the transaction and continue with the next file
            db.session.rollback()
            print(f"Skipping file {file}: {e}")
            continue


def seed_playlists():
    users = User.query.all()
    songs = Song.query.all()
    for user in users:
        for i in range(5):  # generate 5 playlists for each user
            playlist = Playlist(user=user, name=i)
            db.session.add(playlist)
            song_set = set()  # keep track of songs already added to playlist
            while (
                len(playlist.songs) < 30
            ):  # add songs until the playlist has at least 30 songs
                song = random.choice(songs)
                if (
                    song not in song_set
                ):  # only add song if it hasn't already been added
                    playlist.songs.append(song)
                    song_set.add(song)

    db.session.commit()


def undo_seeds():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.playlists_songs RESTART IDENTITY CASCADE;"
        ),
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.playlists RESTART IDENTITY CASCADE;"
        ),
        db.session.execute(f"TRUNCATE table {SCHEMA}.songs RESTART IDENTITY CASCADE;"),
        db.session.execute(f"TRUNCATE table {SCHEMA}.albums RESTART IDENTITY CASCADE;"),
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.artists RESTART IDENTITY CASCADE;"
        ),
    else:
        db.session.execute(text("DELETE FROM playlists_songs")),
        db.session.execute(text("DELETE FROM playlists")),
        db.session.execute(text("DELETE FROM songs")),
        db.session.execute(text("DELETE FROM albums")),
        db.session.execute(text("DELETE FROM artists")),

    db.session.commit()
