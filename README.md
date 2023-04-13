# Songify Music App
https://songify-2jhs.onrender.com/
<img width="950" alt="Screenshot 2023-04-05 102230" src="https://user-images.githubusercontent.com/105817556/230186226-01c012d4-aa8d-4163-9bf3-f38a3072ef73.png">


## Overview
Songify is a music streaming web application built using JavaScript, React.js, Redux, Flask, SQLAlchemy, and Wavesurfer.js. The app allows users to browse, search,   and play songs from a cloud server, in this case Backblaze B2 buckets. The app has a responsive design that allows for seamless playback of audio files while           navigating through different pages.

* Technologies Used
* JavaScript
* Python
* React.js
* Redux
* Flask
* SQLAlchemy
* Faker
* Wavesurfer.js
* Backblaze B2


## Features
User authentication and authorization
Browse and search for songs by artist, album, or song title
Play songs using a customized audio playbar that allows for seeking and volume control
Create and edit playlists
Add and remove songs from playlists
Responsive design optimized for desktop and mobile devices
## Challenges
This project posed a significant technical challenge in the implementation of Wavesurfer.js for the playback of audio files while navigating through various pages. The process involved a considerable amount of research, experimentation, and refactoring to ensure seamless and uninterrupted audio playback. The useEffect function for the Wavesurfer component was the primary area of focus, where I had to find the optimal solution to parse the store correctly for the audio files.

To achieve this, I utilized a range of approaches to ensure that the Wavesurfer component functioned effectively and efficiently. This included in-depth analysis of the different aspects of the code, such as data structures, event handling, and the manipulation of the audio files. Additionally, I worked on the optimization of the code structure and organization to enhance the overall performance of the application.

Overall, the technical challenge involved in implementing Wavesurfer.js for audio playback in Songiufy was an excellent opportunity for me to hone my problem-solving and research skills. Through perseverance and determination, I was able to overcome the obstacles and create a functional and user-friendly music application.
"""
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import WaveSurfer from "wavesurfer.js";
```
  useEffect(() => {

    setSource(songUrl || fileUrl || "");

  }, [fileUrl, songUrl, source]);

  useEffect(() => {
    if (source) {
      if (waveSurfer) {
        waveSurfer.load(source);
      } else {
        const ws = WaveSurfer.create({
          container: waveformRef.current,
          waveColor: "transparent",
          progressColor: "transparent",
          cursorColor: "transparent",
          barWidth: 2,
          barRadius: 3,
          responsive: true,
          height: 50,
        });
        ws.on("ready", () => {
          ws.play();
          setIsPlaying(true);
          setDuration(ws.getDuration());
          ws.on("audioprocess", () => {
            setCurrentTime(ws.getCurrentTime());
          });
        });
        ws.load(source);
        setWaveSurfer(ws);
      }
    }
  }, [source, waveSurfer]);

```



## Future Improvements
Implement a recommendation engine based on user listening history and preferences
Add social features, such as user profiles and the ability to follow other users and share playlists
Implement a feature for users to upload their own music to the cloud server
Screenshots
Songiufy Music App

## Getting Started
To get started with the app, follow these steps:

* Clone this repository
* Install dependencies using npm install
* Create a virtual environment and install Python dependencies using pip install -r requirements.txt
* Create a .env file in the project root directory and add your Backblaze B2 credentials, Flask secret key, and other required environment variables
* Start the Flask server using python app.py
* Start the React app using npm start
* Open the app in your browser at http://localhost:3000

### auth_routes /api/auth/

	* Request
		* Mehtod: GET
		* URL: /api/auth/
		* Body: none
	* Successful Response
		* StatusCode: 200
		* headers: content-type:application/json
		* Body: ```{
			"id": 1,
			"username": "DemoUser",
			"email": "Demo@aa.io"
		}```
		
		


### auth_routes /api/auth/login

	* Request
		* Mehtod: POST
		* URL: /api/auth/login
		* Headers: content-type:application/json
		* Body: ```{
		"username":DemoUser,
		password:'*******'
		}```
	* Successful Response
		* StatusCode: 200
		* headers: content-type:application/json
		* Body: ```{
			"id": 1,
			"username": "DemoUser",
			"email": "Demo@aa.io"
		}```		
		
	* falied Response
		* StatusCode: 401
		* Headers: content-type:application/json
		* body: ```{
			"errors": "username or password incorrect"
		}```
		
	


### auth_routes /api/auth/logout

	* Request
		* Mehtod: GET
		* URL: /api/auth/logout
		* Body: none
	* Successful Response
		* StatusCode: 200
		* headers: content-type:application/json
		* Body: ```{
			'message': 'user logged out'
		}```


### user_routes /api/users/


	* Request
		* Method: GET
		* URL: /api/users/
		* Headers: content-type:application/json, Authorization: Bearer <access_token>
		* Body: none
	* Successful Response
		* StatusCode: 200
		* Headers: content-type:application/json
		* Body: ```{
			"users": [
				{
					"id": 1,
					"username": "DemoUser1",
					"email": "demo1@example.com"
				},
				{
					"id": 2,
					"username": "DemoUser2",
					"email": "demo2@example.com"
				}
			]
		}```


### user_routes /api/users/:id

	* Request
		* Method: GET
		* URL: /api/users/:id
		* Headers: content-type:application/json, Authorization: Bearer <access_token>
		* Body: none
		* Params: id - integer
	* Successful Response
		* StatusCode: 200
		* Headers: content-type:application/json
		* Body: ```{
			"id": 1,
			"username": "DemoUser1",
			"email": "demo1@example.com"
		}```

	* Failed Response
		* StatusCode: 404
		* Headers: content-type:application/json
		* Body: ```{
			"errors": "User not found"
		}```




### admin_routes /api/admin/upload_song
	* Request
		* Method: POST
		* URL: /api/admin/upload_song
		* Headers: Authorization: Basic [base64 encoded string of application_key_id and application_key]
		* Body: multipart/form-data containing file to upload
	Successful Response
		Status Code: 200
		Headers: content-type: application/json
		Body: ```{
			"message": "Upload successful"```
	Failed Response
		Status Code: 400
		Headers: content-type: application/json
	Body: {"error": "No file uploaded"}

	Note:

		* This endpoint is accessible only by admin users.
		* The API requires an application key ID, application key, and bucket ID which are fetched from environment variables.
		* The authentication details are sent in the Authorization header as a base64-encoded string of application_key_id:application_key.
		* The API makes a request to Backblaze B2 API to authorize the account.
		* The upload URL and authorization token are received from the response.
		* The API expects a file to be uploaded in a multipart/form-data format.
		



### admin_routes /api/admin/songs/int:id


	* Request
		* Mehtod: PUT
		* URL: /api/admin/songs/{id}
		* Headers: content-type:application/json
		* Body: ```{
				"title":"new song title"
			}```
	* Successful Response
		* StatusCode: 200
		* headers: content-type:application/json
		* Body: ```{
				"message": "Song updated"
			}```
		
		
		
		
### admin_routes /api/admin/songs/int:id


	* Request
		* Mehtod: GET, PUT, DELETE
		* URL: /api/admin/songs/{id}
		* PUT Body: ```{
			"title":"newTitle"
		}```
	* Successful Response
		* For GET method
			* StatusCode: 200
			* headers: content-type:application/json
			* Body: ```{
				"id": integer,
				"album_id": integer,
				"artist_id": integer,
				"title": "string",
				"album": "album_to_dict",
				"artist": "artist_to_dict"
				}```
		* For DELETE method
			* StatusCode: 200
			* headers: content-type:application/json
			* Body: ```{
			"message": "Song deleted"
			}```
		
		
		
		
### admin_routes /api/admin/albums


	* Request
		* Mehtod: POST
		* URL: /api/admin/albums
		* Headers: content-type:application/json
		* Body: ```{
				"artist_name": "string",
				"name": "string",
				"release_date": "YYYY-MM-DD",
				"album_art": "string url"
			}```
	* Successful Response
		* StatusCode: 200
		* headers: content-type:application/json
		* Body: none
	
	
	
	
### admin_routes /api/admin/albums/int:id


	* Request
		* Mehtod: GET, PUT, DELETE
		* URL: /api/admin/albums/{id}
	* Successful Response
		* For GET method
			* StatusCode: 200
			* headers: content-type:application/json
			* Body: ```{
				"id": integer,
				"name": "string",
				"artist": {
					"name": "string",
					"id": integer
				},
				"album_art": "string",
				"release_date": "YYYY-MM-DD",
				"songs": [{
						"id": integer,
						"title": "string",
						"album_id": integer,
						"artist_id": integer,
						"artist": "string",
						"album": "string"
					},
					...
				]
			}```
		* For DELETE method
			* StatusCode: 200
			* headers: content-type:application/json
			* Body: ```{
				"message": "Album deleted"
			}```
	Note: In the response of GET method on /api/admin/albums/<int:id> endpoint, songs is an array of songs object. If the album has no song, then the songs array will be empty.
	

### admin_routes /api/admin/artists/{id}


	* Request
		* Method: GET, POST, DELETE
		* URL: /api/admin/artists/{id}
		* Headers: 
			- content-type: application/json
			- Authorization: Bearer {token}
		* URL Params: 
			- Required: id=[integer]
			- Example: /api/admin/artists/1
		* Body: none
		
	* Successful Response
		* Status Code: 200
		* Headers: content-type: application/json
		* Body: ```{
			"id": 1,
			"name": "artist_name",
			"albums": [
				{
					"id": 1,
					"title": "album_title",
					"year": "1998",
					"artist_id": 1,
					"artwork_url": "https://album-artwork.com"
				}
			],
			"songs": [
				{
					"id": 1,
					"title": "song_title",
					"length": "3:45",
					"artist_id": 1,
					"album_id": 1,
					"audio_url": "https://song-audio.com"
				}
			]
		}```
	
	* Failed Response
		* Status Code: 404
		* Headers: content-type: application/json
		* Body: ```{
			"message": "Artist not found"
		}```
		
		
	* Update Artist
		* Method: POST
		* URL: /api/admin/artists/{id}
		* Headers: 
			- content-type: application/json
			- Authorization: Bearer {token}
		* URL Params: 
			- Required: id=[integer]
			- Example: /api/admin/artists/1
		* Body: 
			```{
				"name": "new_artist_name"
			}```
		
		* Successful Response
			* Status Code: 200
			* Headers: content-type: application/json
			* Body: ```{
				"id": 1,
				"name": "new_artist_name",
				"albums": [
					{
						"id": 1,
						"title": "album_title",
						"year": "1998",
						"artist_id": 1,
						"artwork_url": "https://album-artwork.com"
					}
				],
				"songs": [
					{
						"id": 1,
						"title": "song_title",
						"length": "3:45",
						"artist_id": 1,
						"album_id": 1,
						"audio_url": "https://song-audio.com"
					}
				]
			}```
		
		* Failed Response
			* Status Code: 400
			* Headers: content-type: application/json
			* Body: ```{
				"errors": ["Invalid field"]
			}```
		
			
	* Delete Artist
		* Method: DELETE
		* URL: /api/admin/delete_artist/{id}
		* Headers: 
			- content-type: application/json
			- Authorization: Bearer {token}
		* URL Params: 
			- Required: id=[integer]
			- Example: /api/admin/delete_artist/1
		* Body: none
	* Successful Response
		* StatusCode: 200
		* headers: content-type:application/json
		* Body: ```{
				"message": "Album deleted"
			}```
	*Failed Response
		*statusCode: 404
	


### admin_routes /api/artists/all


	* Request
		* Method: GET
		* URL: /api/artists/all
		* Body: none
	* Successful Response
		* StatusCode: 200
		* headers: content-type: application/json
		* Body: ```[		{		"id": 1,		"name": "artist_name",		"photo_url": "url"		},		{		"id": 2,		"name": "artist_name",		"photo_url": "url"		},		...	]```
		
### admin_routes /api/albums/all

	
	* Request
		* Method: GET
		* URL: /api/albums/all
		* Body: none
	* Successful Response
		* StatusCode: 200
		* headers: content-type: application/json
		* Body: ```[		{		"id": 1,		"title": "album_title",		"year": 2001,		"artist_id": 1,		"photo_url": "url"		},		{		"id": 2,		"title": "album_title",		"year": 2001,		"artist_id": 1,		"photo_url": "url"		},		...	]```
### admin_routes /api/songs/all


	* Request
		* Method: GET
		* URL: /api/songs/all
		* Body: none
	* Successful Response
		* StatusCode: 200
		* headers: content-type: application/json
		* Body: ```{
				"id": integer,
				"album_id": integer,
				"artist_id": integer,
				"title": "string",
				"album": "album_to_dict",
				"artist": "artist_to_dict"
				}```
			
	


		

## Credits
* Backblaze B2 - for providing cloud storage for audio files
* Wavesurfer.js - for providing the audio player component used in the app
* react.js - for providing the framework for creating the frontend components
* flask-sqlalchemy - for a comprehnsive and intuitive database managment system
* backblaze - for providing storage for music files
