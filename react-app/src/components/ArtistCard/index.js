// ArtistCard.js

import React from "react";
import { useHistory } from "react-router-dom";
import "./index.css";

const ArtistCard = ({ artist }) => {
  const history = useHistory();

  const handleClick = (e) => {
    e.preventDefault();
    history.push(`/artists/${artist.id}`);
  };

  return (
    <div className="ArtistCard" onClick={handleClick}>
      <div className="AlbumCard__art">
        {artist?.image ? (
          <img src={artist?.image} alt={`${artist}`} />
        ) : (
          <div className="AlbumCard__art-placeholder">
            <img
              src="https://f005.backblazeb2.com/file/capstonestorage/default_image.PNG"
              alt="art placeholder"
            />
          </div>
        )}
      </div>
      <div className="ArtistCard__details">
        <h3 className="ArtistCard__name">{artist.name}</h3>
      </div>
    </div>
  );
};

export default ArtistCard;
