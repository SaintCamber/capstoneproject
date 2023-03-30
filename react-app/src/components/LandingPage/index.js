import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAlbums } from '../../store/music';
import AlbumCard from '../AlbumCard';
export default function LandingPage() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const user = useSelector(state => state.session.user);
  const albums = useSelector(state => state.music.albums);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  useEffect(() => {
    dispatch(getAlbums())
    setLoading(false)
  }, []);

  return (
    <div className="LandingPage">
      <div className="LandingPage__container">
        <div className="LandingPage__container__left">
          <div className="LandingPage__container__left__text">
            <h1>Music for everyone.</h1>
            <h2>Millions of songs. No credit card needed.</h2>
            <button className="LandingPage__container__left__button">GET SONGIFY FREE</button>
          </div>
        </div>
        <div className="LandingPage__container__right">
          <img src="../../../public/default_image.png"></img>

        </div>
        <div>
          <h1>Popular Albums</h1>
          <div className="LandingPage__container__albums">
            {albums && Object.values(albums).map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
