import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAlbums } from '../../store/music';
import { getAlbumsPages } from '../../store/music';
import { getAllPlaylists } from '../../store/playlists';
import AlbumCard from '../AlbumCard';
import PlaylistCard from '../playlistCard/playlistcard';
import './LandingPage.css';
import LoginPrompt from './loginPrompt';
export default function LandingPage() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [albumsLoaded, setAlbumsLoaded] = useState(false);
  const Pages = useSelector(state => state.music.pages);
  const user = useSelector(state => state.session.user);
  const albums = useSelector(state => state.music.albums);
  const playlists = useSelector(state => state.playlists.user_playlists);


  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  useEffect(() => {
    async function fetchData() {
      await dispatch(getAllPlaylists(user?.id));
      // await dispatch(getAlbums());
      await dispatch(getAlbumsPages());
      setAlbumsLoaded(true);
      setLoading(false);
    }
    fetchData();
  }, [dispatch, user?.id]);

  const handleLoadMore = async () => {
  if (Pages.hasNextPage) {
    await dispatch(getAlbumsPages(Pages.currentPage + 1));
  }

}
  

   const randomAlbums = albums ? Object.values(albums).sort(() => 0.5 - Math.random()).slice(0, 15) : [];
   
  if (!user) {
    return (<LoginPrompt />)}

    if (loading || !albumsLoaded) { 
      return <h1>Loading...</h1>;
    }
  return  (
      <div className="LandingPage">
      <div className="LandingPage__container">
        <div className="LandingPage__container__left">
         <div className="LandingPage__container__left__text">
            <h1>Music for everyone.</h1>
            <h2>Welcome to Songify!</h2>
          </div>
        </div>
        <div className="LandingPage__container__right">
          <span></span>
        </div>
        <div className="LandingPage__music__container">
          <h1 className="LandingPage__music__Header">your Playlists</h1>
          <div className="LandingPage__container__playlists">
            {Object.values(playlists).length ? Object.values(playlists).map((playlist) => (
              <PlaylistCard key={playlist?.id} playlist={playlist} />
            )) : <h2 className="alt_header" >You don't have any playlists yet!</h2>}
          <h1 className="LandingPage__music__Header" >Discover Albums</h1>
        </div>
         
          {albums && (<div>{albums.map(album=> <AlbumCard key={album?.id} album={album} />)}</div>)}
          
          </div >
          
          <div>
          {Pages.hasNextPage ? <h8 className='loadmore' onClick={handleLoadMore}>load more</h8>:''}

          </div>
          
      </div>
    </div>
  );
}
