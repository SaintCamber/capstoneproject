import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import * as musicActions from "../../store/music";
import "./admin.css"

export const AdminPanel = () => {
  const dispatch = useDispatch();
  const albums = useSelector((state) => state.music.albums);
  const artists = useSelector((state) => state.music.artists);
  const songs = useSelector((state) => state.music.songs);
  const [loading, setLoading] = useState(true);
  const [openArtist, setOpenArtist] = useState(null);
  const [openAlbum, setOpenAlbum] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  useEffect(() => {
    dispatch(musicActions.getAlbums());
    dispatch(musicActions.getAllArtistsThunk());
    dispatch(musicActions.getSongs());
    setLoading(false);
  }, []);

  const handleArtistClick = (artistId) => {
    if (openArtist === artistId) {
      setOpenArtist(null);
    } else {
      setOpenArtist(artistId);
    }
    setOpenAlbum(null);
  };

  const handleAlbumClick = (albumId) => {
    if (openAlbum === albumId) {
      setOpenAlbum(null);
    } else {
      setOpenAlbum(albumId);
    }
  };

  const handleClickOutside = (e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      setOpenArtist(null);
      setOpenAlbum(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="AdminPanel" ref={containerRef}>
      <div className="AdminPanel__container">
        <div className="AdminPanel__container__left">
          <div className="AdminPanel__container__left__text">
            <h1>Admin Panel</h1>
            <h2>Here you can see all the music in the database</h2>
          </div>
        </div>
        <div className="AdminPanel__container__right">
          <img src="https://i.imgur.com/8QZQY0C.png" alt="songify logo" />
        </div>
        <div>
          <h1>Artists</h1>
          <div className="AdminPanel__container__artists">
            {artists &&
              Object.values(artists).map((artist) => (
                <div key={artist.id}>
                  <h2 onClick={() => handleArtistClick(artist.id)}>
                    {artist.name}
                  </h2>
                  {openArtist === artist.id && (
                    <ul>
                      <h3>Albums</h3>
                      {artist.albums.map((album) => (
                        <li key={album.id}>
                          <h4 onClick={() => handleAlbumClick(album.id)}>
                            {album.name}
                          </h4>
                          {openAlbum === album.id && (
                            <ul>
                              {album.songs.map((song) => (
                                <li key={song.id}>{song.title}
                                  <OpenModalButton
                                    buttonText="Log In"
                                    onItemClick={closeMenu}
                                    modalComponent={<DeleteSongModal songId={song.id} />}
                                  />
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;