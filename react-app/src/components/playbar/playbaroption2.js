import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import WaveSurfer from "wavesurfer.js";

const Playbar = () => {
    const waveformRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [source, setSource] = useState("");
    const songUrl = useSelector((state) => state.music.songUrl);
    const currentlyPlaying = useSelector(
        (state) => state.music.currentlyPlaying
    );
    const fileUrl = currentlyPlaying ? currentlyPlaying.file_url : "";

    const [waveSurfer, setWaveSurfer] = useState(null);

    useEffect(() => {
        if (!source) {
            setSource(songUrl||fileUrl ||  "");
        }
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
                });
                ws.load(source);
                setWaveSurfer(ws);
            }
        }
    }, [source, waveSurfer]);

    const togglePlay = () => {
        if (isPlaying) {
            waveSurfer.pause();
        } else {
            waveSurfer.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div>
            {source ? (
                <>
                    <div ref={waveformRef} />
                    <button onClick={togglePlay}>
                        {isPlaying ? "Pause" : "Play"}
                    </button>
                </>
            ) : (
                <p>No audio source available</p>
            )}
        </div>
    );
};

export default Playbar;