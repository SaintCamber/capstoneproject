import { useHistory } from "react-router-dom";

function SongRowAP({ song }) {
  let history = useHistory();

  const goToAlbum = () => {
    history.push(`/albums/${song.album_id}`);
  };

  return (
    <div className="SongRowAp" onClick={goToAlbum}>
      <h1>{song.title}</h1>
      <h4>{song.album}</h4>
    </div>
  );
}

export default SongRowAP;
