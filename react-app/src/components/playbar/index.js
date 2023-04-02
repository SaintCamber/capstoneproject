import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import WaveSurfer from "wavesurfer.js";

const Playbar = () => {
  const waveformRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [source, setSource] = useState("");
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const songUrl = useSelector((state) => state.music.songUrl);
  const currentlyPlaying = useSelector(
    (state) => state.music.currentlyPlaying
  );
  const fileUrl = currentlyPlaying ? currentlyPlaying.file_url : "";

  const [waveSurfer, setWaveSurfer] = useState(null);

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
          waveColor: "gray",
          progressColor: "orange",
          cursorColor: "black",
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

  const togglePlay = () => {
    if (waveSurfer) {


      if (isPlaying) {
        waveSurfer.pause();
      } else {
        waveSurfer.play();
      }
      setIsPlaying(!isPlaying)
    } else {
      return
    }
  };
  const regex = /^\d+\s/;

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };
  return (
    <div className="playbar">
      <div className="playbar__song-info">
        <div className="playbar__song-image">
          <img src={currentlyPlaying?.album_art || "https://f005.backblazeb2.com/file/capstonestorage/default_image.PNG"} alt={currentlyPlaying?.title || ""} />
        </div>
        <div className="playbar__song-details">
          <p>{currentlyPlaying?.title.replace(regex, ``) || ""}</p>
          <p>{currentlyPlaying?.artist || ""}</p>
        </div>
      
      </div>
      <div className="playbar__center">
        <div className="playbar__controls">
          <button className="playbar__button" onClick={togglePlay}>
            <i className="fas fa-play"></i>
          </button>
          <button className="playbar__button" onClick={togglePlay}>
            <i className="fas fa-pause"></i>
          </button>
        </div>
        <div className="playbar__progress">
          <div className="playbar__song-progress">
          <div className="playbar__progress-bar" ref={waveformRef}>
            <div
              className="playbar__progress-bar-current"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <div className="playbar__duration">
            {formatTime(currentTime)} / {formatTime(duration)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playbar;
