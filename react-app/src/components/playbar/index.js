import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadSong,
  playSong,
  pauseSong,
  stopSong,
} from "../../store/music";

const Playbar = () => {
  const dispatch = useDispatch();
  const isPlaying = useSelector(state => state.music.isPlaying);
  const songUrl = useSelector(state => state.music.chosenSong);

  const handlePlay = () => {
    dispatch(playSong());
  };

  const handlePause = () => {
    dispatch(pauseSong());
  };

  const handleStop = () => {
    dispatch(stopSong());
  };

  return (
    <div className="Playbar">
      <div id="waveform"></div>
      <button onClick={handlePlay}>Play</button>
      <button onClick={handlePause}>Pause</button>
      <button onClick={handleStop}>Stop</button>
      {isPlaying && <p>Now playing: {songUrl}</p>}
    </div>
  );
};

export default Playbar;