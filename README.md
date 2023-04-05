# Songiufy Music App
## Overview
Songiufy is a music streaming web application built using JavaScript, React.js, Redux, Flask, SQLAlchemy, and Wavesurfer.js. The app allows users to browse, search,   and play songs from a cloud server, in this case Backblaze B2 buckets. The app has a responsive design that allows for seamless playback of audio files while           navigating through different pages.

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
One of the biggest challenges of this project was learning how to properly implement Wavesurfer.js to play audio files while navigating through different pages. The solution involved designing the app structure to optimize performance and minimize loading times. Another challenge was implementing user authentication and authorization, which required integrating Flask with React.js and Redux.

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
## Credits
* Backblaze B2 - for providing cloud storage for audio files
* Wavesurfer.js - for providing the audio player component used in the app
* react.js - for providing the framework for creating the frontend components
* flask-sqlalchemy - for a comprehnsive and intuitive database managment system
* backblaze - for providing storage for music files
