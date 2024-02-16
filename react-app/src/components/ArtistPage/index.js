import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getSingleArtist } from "../../store/music";
import AlbumCard from "../AlbumCard";
import "./index.css";

const ArtistPage = () => {
  const dispatch = useDispatch();
  const artist = useSelector((state) => state.music.artists);
  const [errors, setErrors] = useState([]);
  const user = useSelector((state) => state.session.user);
  const { artistId } = useParams();

  useEffect(() => {
    dispatch(getSingleArtist(artistId));
  }, [dispatch, artistId]);

  const helperLog = () => {
    console.log(artist);
  };

  return (
    <div className="ArtistPage" onClick={helperLog}>
      {artist && (
        <div className="ArtistPage__top">
          <div className="ArtistPage__art"></div>
          <div className="ArtistPage__details">{<h1>{artist?.name}</h1>}</div>
        </div>
      )}

      {artist.albums && (
        <div className="ArtistPage__albums">
          <h3>Albums</h3>
          {artist?.albums?.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      )}

      {artist.songs && (
        <div className="ArtistPage__songs">
          <h3>Songs</h3>
        </div>
      )}
    </div>
  );
};

export default ArtistPage;
