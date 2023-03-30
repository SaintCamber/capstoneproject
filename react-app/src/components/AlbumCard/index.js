import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getSingleAlbum } from '../../store/music';

function AlbumCard({ album }) {
  const history = useHistory();
  const dispatch = useDispatch();

  const handleCardClick = (e) => {
    e.preventDefault();
    dispatch(getSingleAlbum(album.id));
    history.push(`/albums/${album.id}`);
  };

  return (
    <div className="AlbumCard" onClick={handleCardClick}>
      <div className="AlbumCard__art">
        {album.album_art ? (
          <img src={album.album_art} alt={`Album art for ${album}`} />
        ) : (
          <div className="AlbumCard__art-placeholder">
            <svg role="img" height="64" width="64" aria-hidden="true" data-testid="card-image-fallback" viewBox="0 0 24 24" data-encore-id="icon" class="Svg-sc-ytk21e-0 gQUQL">
              <path d="M6 3h15v15.167a3.5 3.5 0 1 1-3.5-3.5H19V5H8v13.167a3.5 3.5 0 1 1-3.5-3.5H6V3zm0 13.667H4.5a1.5 1.5 0 1 0 1.5 1.5v-1.5zm13 0h-1.5a1.5 1.5 0 1 0 1.5 1.5v-1.5z"></path>
            </svg>
          </div>
        )}
      </div>
      <div className="AlbumCard__details">
        <h3>{album.name}</h3>
        <p>{album.artist}</p>
      </div>
    </div>
  );
}

export default AlbumCard;