import React, { useState, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";

const Playbar = ({ songUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveSurfer, setWaveSurfer] = useState(null);

  useEffect(() => {
    // Initialize WaveSurfer player
    const waveSurfer = WaveSurfer.create({
      container: "#waveform",
      waveColor: "#999",
      progressColor: "#333",
    });

    setWaveSurfer(waveSurfer);

    // Load the audio file from S3
    waveSurfer.load(songUrl);

    // Add event listeners
    waveSurfer.on("play", () => {
      setIsPlaying(true);
    });

    waveSurfer.on("pause", () => {
      setIsPlaying(false);
    });

    waveSurfer.on("finish", () => {
      setIsPlaying(false);
    });

    // Cleanup
    return () => waveSurfer.destroy();
  }, [songUrl]);

  const handlePlay = () => {
    waveSurfer.play();
  };

  const handlePause = () => {
    waveSurfer.pause();
  };

  const handleStop = () => {
    waveSurfer.stop();
    setIsPlaying(false);
  };

  return (
    <div>
      <div id="waveform"></div>
      <button onClick={handlePlay}>Play</button>
      <button onClick={handlePause}>Pause</button>
      <button onClick={handleStop}>Stop</button>
      {isPlaying && <p>Now playing: {songUrl}</p>}
    </div>
  );
};

export default Playbar;
