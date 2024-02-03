import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getSingleAlbum, playAlbumThunk } from '../../store/music';
import './albumcard.css';

function AlbumCard({ album }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [showPlay, setShowPlay] = React.useState(false);

  const playAlbum = (e) => {
    e.stopPropagation();
    dispatch(getSingleAlbum(album.id));
    dispatch(playAlbumThunk(album));
  };


  const handleCardClick = (e) => {
    e.preventDefault();
    dispatch(getSingleAlbum(album.id));
    history.push(`/albums/${album.id}`);
  };

  const handleMouseEnter = () => {
    setShowPlay(true);
  }
  
  const handleMouseLeave = () => {
    setShowPlay(false);
  }
  const className = showPlay ? "AlbumCard__play" :"hidden"
  return (
    <div className="AlbumCard" onClick={handleCardClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="AlbumCard__art">
        {album?.album_art ? (
          <img src={album?.album_art} alt={`Album art for ${album}`} />
        ) : (
          <div className="AlbumCard__art-placeholder">
            <img src="https://f005.backblazeb2.com/file/capstonestorage/default_image.PNG" alt="Album art placeholder" />
          </div>
        )}
      </div>
    
      <div className="AlbumCard__details">
        <h3>{album?.name}</h3>
        <p>{album?.artist}</p>
      </div>
    </div>
  );
}

export default AlbumCard;