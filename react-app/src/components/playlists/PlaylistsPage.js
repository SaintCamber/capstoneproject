import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { addSongToPlaylist, getAllPlaylists } from '../../store/playlists';
import { chooseSong, getSongs } from '../../store/music';
import SongCard from '../../components/songCard'
import RenderedSongs from './RenderedSongs';
function PlaylistPage() {
    const dispatch = useDispatch();
    const { id } = useParams();
    console.log(id)
    const [showAllSongs, setShowAllSongs] = useState(false);
    const user = useSelector(state => state.session.user);
    const songs = useSelector(state => state.music.songs);
    const playlists = useSelector(state => state.playlists.user_playlists)
    const playlist = playlists

    console.log(playlists, 'playlists in the playlist page')
    useEffect(() => {
        dispatch(getSongs());
        dispatch(getAllPlaylists(user?.id));
    }, [dispatch, user?.id, id]);


    const handleShowAllSongs = (e) => {
        e.preventDefault()
        setShowAllSongs(!showAllSongs);
        console.log(showAllSongs, 'showAllSongs')
    };


    return (
        <>
            <h1>Playlist Page</h1>

            <div>
                <h2>{playlist?.name}</h2>
                <button onClick={handleShowAllSongs}>Add Song</button>
                {showAllSongs ? <RenderedSongs playlist={playlist} handleShowAllSongs={handleShowAllSongs} showAllSongs={setShowAllSongs} /> : playlist?.songs.map((song) => {
                    return <SongCard song={song} />
                })}
                {!showAllSongs ? <button onClick={handleShowAllSongs}>done adding songs</button> : ""}

            </div>

        </>
    );
}

export default PlaylistPage;