import {useState,useEffect } from 'react';
import {useDispatch,useSelector} from 'react-redux';
import { useHistory,useDispatch } from 'react-router-dom';
import { getAllPlaylists } from '../../store/playlists';




const ArtistLibrary = (Artist)=>{
    const dispatch = useDispatch();
    const history = useHistory();
    const playlists = useSelector(state => state.playlists.user_playlists);
    const user = useSelector(state => state.session.user);


    useEffect(() => {
        window.scrollTo(0, 0)
    }, []);

    useEffect(() => {(
        getAllPlaylists(user?.id)
        )}, [dispatch, user?.id]);

    return (

        <div className="artist-page">
            <div className="artist-page__header">
            </div>
            <div className="artist-page__body">
            {playlists.map((playlist) => {
                playlist?.songs.map((song)=>{
                   let artist=song.artist
                     


                }) 
            })        
    
}