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
## Credits
* Backblaze B2 - for providing cloud storage for audio files
* Wavesurfer.js - for providing the audio player component used in the app
* react.js - for providing the framework for creating the frontend components
* flask-sqlalchemy - for a comprehnsive and intuitive database managment system
* backblaze - for providing storage for music files
