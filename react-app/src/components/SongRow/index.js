import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { playSong, addSongToQueueNextThunk } from '../../store/music';
import { initWaveSurfer } from '../../components/playbar/wavesurferUtils';
import { removeSongFromPlaylist } from '../../store/playlists';
import { getSinglePlaylist } from '../../store/playlists';


import "./SongRow.css"

function SongRow({ song, trackNumber, PlaylistId }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const songRef = useRef();
  const waveformRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  // create a regex that removes any numbers or special characters from the song
  const regex = /^\d+\s/
  let title = song.title.replace(regex, ``)

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!songRef.current.contains(e.target)) {
        setShowMenu(false);
      }

    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const handleRemoveSong = () => {
    dispatch(removeSongFromPlaylist(PlaylistId, song.id));
    dispatch(getSinglePlaylist(PlaylistId))
  }




  const SongClassName = "actions-dropdown" + (showMenu ? "" : " hidden");
  const closeMenu = () => setShowMenu(false);

  const PlaySong = () => {
    dispatch(playSong(song));
    initWaveSurfer(waveformRef.current, song.audioUrl);
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  }

  const handleAddToQueue = () => {
    dispatch(addSongToQueueNextThunk(song));
  }


  return (
    <div className="SongRow" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="SongRow__track">
        {isHovered ? (
          <i className="fas fa-play" onClick={PlaySong} />
        ) : (
          <div>{trackNumber}</div>
        )}
      </div>
      <div className="SongRow__info">
        <div className="SongRow__title">{title}</div>
        <div className="SongRow__artist">{song.album} {song.artist}</div>
      </div>
      <div className="SongRow__actions">
        <i className={isFavorite ? "fas fa-heart" : "far fa-heart"} onClick={toggleFavorite} />
        <i className="fas fa-ellipsis-h" onClick={openMenu} />
        <div className={SongClassName} ref={songRef}>
          <button onClick={handleAddToQueue}>Add to queue</button>
          {PlaylistId ? <button onClick={handleRemoveSong}>Remove from playlist</button>:""}
          {/* Add other song related actions here */}
        </div>
      </div>
      <div className="SongRow__waveform" ref={waveformRef}></div>
    </div>
  );
}

export default SongRow;