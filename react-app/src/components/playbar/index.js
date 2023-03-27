import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { playSong, stopSong, pauseSong } from "../../store/music";
import WaveSurfer from "wavesurfer.js";

const Playbar = () => {
  const dispatch = useDispatch();
  const isPlaying = useSelector((state) => state.music.isPlaying);
  const songUrl = useSelector((state) => state.music.chosenSong);
  const songTitle = useSelector((state) => state.music.songTitle);
  const songArtist = useSelector((state) => state.music.songArtist);
  const songAlbum = useSelector((state) => state.music.songAlbum);

  const wavesurferRef = useRef(null);

  useEffect(() => {
    if (songUrl) {
      const wavesurfer = WaveSurfer.create({
        container: wavesurferRef.current,
        waveColor: "#B3B3B3",
        progressColor: "#1DB954",
        height: 5,
        barWidth: 1,
        barHeight: 5,
        cursorWidth: 0,
        normalize: true,
        responsive: true,
      });
      wavesurfer.load(songUrl);
      wavesurfer.on("finish", handleStop);
      return () => {
        wavesurfer.destroy();
      };
    }
  }, [songUrl]);

  const handlePlay = () => {
    dispatch(playSong());
    wavesurferRef.current.play();
  };

  const handlePause = () => {
    dispatch(pauseSong());
    wavesurferRef.current.pause();
  };

  const handleStop = () => {
    dispatch(stopSong());
    wavesurferRef.current.stop();
  };

  const handleVolumeChange = (e) => {
    wavesurferRef.current.setVolume(e.target.value);
  };

  return (
    <div className="playbar">
      <div className="playbar__song-info">
        <div className="playbar__song-image">
          <img
            src={songAlbum || "https://via.placeholder.com/50"}
            alt={songTitle || "Unknown song"}
          />
        </div>
        <div className="playbar__song-details">
          <p>{songTitle || "Unknown song"}</p>
          <p>{songArtist || "Unknown artist"}</p>
        </div>
      </div>
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
      <div className="playbar__volume">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          defaultValue="1"
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};

export default Playbar;
