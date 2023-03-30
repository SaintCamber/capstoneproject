import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAlbums } from '../../store/music';
import { getAllPlaylists } from '../../store/playlists';
import AlbumCard from '../AlbumCard';
import PlaylistCard from '../playlistCard/playlistcard';
export default function LandingPage() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const user = useSelector(state => state.session.user);
  const albums = useSelector(state => state.music.albums);
  const playlists = useSelector(state => state.playlists.user_playlists);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  useEffect(() => {
    dispatch(getAlbums())
    dispatch(getAllPlaylists(user?.id))
    
    console.log(playlists, 'playlists in the landing page')
    setLoading(false)
  }, []);

  return (
    <div className="LandingPage">
      <div className="LandingPage__container">
        <div className="LandingPage__container__left">
          <div className="LandingPage__container__left__text">
            <h1>Music for everyone.</h1>
            <h2>Welcome to Songify!</h2>
          </div>
        </div>
        <div className="LandingPage__container__right">
          <img src="../../../public/default_image.png"></img>

        </div>
        <div>
          <h1>your Playlists</h1>
          <div className="LandingPage__container__playlists">
            {playlists && Object.values(playlists).map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          <h1>Popular Albums</h1>
          <div className="LandingPage__container__albums">
            {albums && Object.values(albums).map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
