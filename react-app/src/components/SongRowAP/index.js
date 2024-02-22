import { useHistory } from "react-router-dom";
import "./index.css";
function SongRowAP({ song }) {
  let history = useHistory();

  const goToAlbum = () => {
    history.push(`/albums/${song.album_id}`);
  };

  return (
    <div className="SongRowAP" onClick={goToAlbum}>
      <div className="SongDetails">
        <div className="SongTitle">{song.title}</div>
        <div className="SongAlbum">{song.album}</div>
      </div>
    </div>
  );
}

export default SongRowAP;
