import { useHistory } from "react-router-dom";
import "./index.css";
function SongRowAP({ song }) {
  let history = useHistory();

  const goToAlbum = () => {
    history.push(`/albums/${song.album_id}`);
  };

  return (
    <div className="SongRowAP" onClick={goToAlbum}>
      <h2>{song.title}</h2>
      <h5>{song.album}</h5>
    </div>
  );
}

export default SongRowAP;
