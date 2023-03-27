import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import SongCard from '../AlbumCard';
import { addSongToPlaylist } from '../../store/playlists';




const RenderedSongs = (playlist, handleShowAllSongs, showAllSongs) => {
    const dispatch = useDispatch();
    const songs = useSelector(state => state.music.songs);
    const handleAddSongToPlaylist = (songId) => {
        dispatch(addSongToPlaylist(playlist.id, songId));
    };


    console.log(playlist, 'playlist in the rendered songs')

    return (
        <div>
            <div>
                <h2>{playlist?.title}</h2>
            </div>

            {!showAllSongs ? "" : (Object.values(songs).map((song) => {
                return <div>
                    <SongCard song={song} />
                    <button onClick={() => handleAddSongToPlaylist(song.id)}>Add Song to Playlist</button>
                </div>
            }))}
            <button onclick={handleShowAllSongs}>Done Adding Songs</button>
        </div>
    )
}

export default RenderedSongs;