import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { playSongThunk } from "../../store/music";
import "./SongCard.css";

function SongCard({ song }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [showPlay, setShowPlay] = React.useState(false);

  const playSong = (e) => {
    e.stopPropagation();
    dispatch(playSongThunk(song));
  };

  const handleCardClick = (e) => {
    e.preventDefault();
    dispatch(playSongThunk(song));

    history.push(`/albums/${song.album_id}`);
  };

  const handleMouseEnter = () => {
    setShowPlay(true);
  };

  const handleMouseLeave = () => {
    setShowPlay(false);
  };

  const className = showPlay ? "SongCard__play" : "hidden";

  return (
    <div
      className="SongCard"
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Render song details and play button similar to AlbumCard */}
      <div className="SongCard-details">
        <h3>{song?.title}</h3>
        <p>{song?.artist}</p>
      </div>
    </div>
  );
}

export default SongCard;
