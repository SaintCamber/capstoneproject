import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getSingleArtistThunk } from "../../store/music";
import "./index.css";

const ArtistPage = () => {
  const dispatch = useDispatch();
  const artist = useSelector((state) => state.music.currentArtist);
  const [errors, setErrors] = useState([]);
  const user = useSelector((state) => state.session.user);
  const albums = artist?.albums;
  const songs = artist?.songs;
  const { artistId } = useParams();

  useEffect(() => {
    dispatch(getSingleArtistThunk(artistId));
  }, [dispatch, artistId]);

  return (
    <div className="ArtistPage">
      {artist && (
        <div className="ArtistPage__top">
          <div className="ArtistPage__art"></div>
          <div className="ArtistPage__details">{<h1>{artist?.name}</h1>}</div>
        </div>
      )}
      <div className="ArtistPage__albums">
        {artist?.albums?.map((album) => {
          <AlbumCard key={album.id} album={album} />;
        })}
      </div>

      <div className="ArtistPage__songs"> {artist?.songs?.map(() => {})}</div>
    </div>
  );
};

export default ArtistPage;
