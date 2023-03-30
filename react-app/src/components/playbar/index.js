import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { play, stop, pause, removeFromQueueThunk } from "../../store/wavesurfer";
import WaveSurfer from "wavesurfer.js";
import { getAlbums } from "../../store/music";

const Playbar = () => {
  const dispatch = useDispatch();
  const { isPlaying, currentlyPlaying, songTitle, songArtist, songAlbum, queue } = useSelector(state => state.music);
  const wavesurferRef = useRef(null);
  const [waveSurfer, setWaveSurfer] = useState(null);

  useEffect(() => {
    const waveSurferInstance = WaveSurfer.create({
      container: wavesurferRef.current,
      waveColor: "#B3B3B3",
      progressColor: "#1DB954",
      height: 5,
      barWidth: 1,
      barHeight: 5,
      cursorWidth: 1,
      normalize: true,
      responsive: true,
      backend: "WebAudio",
    });

    if (currentlyPlaying) {
      waveSurferInstance.load(currentlyPlaying[0], null, "cors");
      waveSurferInstance.on("finish", handleStop);
      setWaveSurfer(waveSurferInstance);

      if (isPlaying) {
        waveSurferInstance.play();
      }
    }

    return () => {
      if (waveSurferInstance) {
        waveSurferInstance.destroy();
      }
    };
  }, [currentlyPlaying]);

  useEffect(() => {
    if (waveSurfer && currentlyPlaying) {
      waveSurfer.load(currentlyPlaying[0], null, "cors");
      waveSurfer.on("finish", handleStop);

      if (isPlaying) {
        waveSurfer.play();
      }
    } else if (queue.length > 0) {
      dispatch(play(queue[0]));
      dispatch(removeFromQueueThunk(0));
    }
  }, [waveSurfer, currentlyPlaying, isPlaying, queue]);

  const handlePlay = () => {
    dispatch(play());

    if (waveSurfer && currentlyPlaying) {
      waveSurfer.play();
    }
  };

  const handlePause = () => {
    if (waveSurfer && currentlyPlaying) {
      dispatch(pause());
      waveSurfer.pause();
    }
  };


  const handleStop = () => {
    if (waveSurfer && isPlaying) {
      dispatch(stop());
      waveSurfer.stop();

      if (queue.length > 0) {
        dispatch(play(queue[0]));
        dispatch(removeFromQueueThunk(0));
      }
    }
  };

  const handleVolumeChange = (e) => {
    if (waveSurfer) {
      waveSurfer.setVolume(e.target.value);
    }
  };


  return (
    <div className="playbar">
      <div className="playbar__song-info">
        <div className="playbar__song-image">
          <img src={songAlbum || "https://via.placeholder.com/50"} alt={songTitle || "Unknown song"} />
        </div>
        <div className="playbar__song-details">
          <p>{songTitle || "Unknown song"}</p>
          <p>{songArtist || "Unknown artist"}</p>
        </div>
      </div>
      <div className="playbar__center">
        <div className="playbar__controls">
          <button className="playbar__button" onClick={handlePlay}>
            <i className="fas fa-play"></i>
          </button>
          <button className="playbar__button" onClick={handlePause}>
            <i className="fas fa-pause"></i>
          </button>
          <button className="playbar__button" onClick={handleStop}>
            <i className="fas fa-stop"></i>
          </button>
        </div>
        <div className="playbar__progress">
          <div className="playbar__progress-bar" ref={wavesurferRef}></div>
        </div>
      </div>
      <div className="playbar__volume">
        <input type="range" min="0" max="1" step="0.01" defaultValue="1" onChange={handleVolumeChange} />
      </div>
    </div>
  );
};

export default Playbar;