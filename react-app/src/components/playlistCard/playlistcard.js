import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getSinglePlaylist, playPlaylistThunk } from '../../store/playlists';
import './playlistCard.css';

function PlaylistCard({ playlist }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [showPlay, setShowPlay] = React.useState(false);

  const playPlaylist = (e) => {
    e.stopPropagation();
    dispatch(getSinglePlaylist(playlist?.id));
    dispatch(playPlaylistThunk(playlist));
  };


  const handleCardClick = (e) => {
    e.preventDefault();
    console.log(playlist?.id, 'playlist id')
    dispatch(getSinglePlaylist(playlist?.id));

    history.push(`/playlists/${playlist?.id}`);
  };

  const handleMouseEnter = () => {
    setShowPlay(true);
  }

  const handleMouseLeave = () => {
    setShowPlay(false);
  }
  const className = showPlay ? "PlaylistCard__play" : "hidden"

  console.log(playlist, 'playlist in the playlist card')
  return (
    <div className="PlaylistCard" onClick={handleCardClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="PlaylistCard__art">
        {playlist?.playlist_art ? (
          <img src={playlist.playlist_art} alt={`Playlist art for ${playlist}`} />
        ) : (
          <div className="PlaylistCard__art-placeholder">
            <img src="https://f005.backblazeb2.com/file/capstonestorage/default_image.PNG" alt="Playlist art placeholder" />
          </div>
        )}
      </div>
     
      <div className="PlaylistCard__details">
        <h3>{playlist?.name}</h3>
        <p>{playlist?.artist}</p>
      </div>
    </div>
  );
}

export default PlaylistCard;