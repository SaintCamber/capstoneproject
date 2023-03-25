import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { readAllAlbums } from '../../store/albums';

export default function LandingPage() {
  const dispatch = useDispatch();
  const { albums } = useSelector(state => state.albums);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(readAllAlbums()).then(() => {
      setLoading(false);
    });
  }, [dispatch]);

  const renderAlbum = album => (
    <div key={album.id}>
      <h1>{album.name}</h1>
      <h2>{album.artist}</h2>
      <h3>{album.songs}</h3>
    </div>
  );

  return (
    <div className="LandingPage">
      <h1>Welcome to the landing page</h1>
      {loading ? (
        <p>Loading albums...</p>
      ) : (
        Object.values(albums).map(renderAlbum)
      )}
    </div>
  );
}




