import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSongToPlaylist, getSinglePlaylist } from '../../store/playlists';
import { getSongs } from '../../store/music';

import SongCard from '../SongCard';

function AddSongToPlaylist({ playlistId }) {
    const dispatch = useDispatch();
    const [errors, setErrors] = useState([]);
    const user = useSelector(state => state.session.user);
    const playlist = useSelector(state => state.playlists.current_playlist);
    const songs = useSelector(state => state.music.songs);
    const [chosenSongId, setChosenSongId] = useState(0);

    const addSong = async (e) => {
        e.preventDefault();
        const songToAdd = {
            song_id: chosenSongId,
            playlist_id: playlistId
        }
        dispatch(addSongToPlaylist(songToAdd));
    }


    useEffect(() => {
        dispatch(getSinglePlaylist(playlistId));
        dispatch(getSongs());
    }, [dispatch, playlistId])

    return (playlist && songs) && (
        <div>
            <h1>Choose a song to add to {playlist.name}:</h1>

            {Object.values(songs).map((song) => (
                <div>
                    <SongCard key={song.id} value={song.id} >{song.title}</SongCard>
                    <button onClick={addSong}>add to playlist</button>
                </div>
            ))}
        </div>
    )
}

export default AddSongToPlaylist;
