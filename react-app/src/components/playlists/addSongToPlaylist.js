import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSongToPlaylist, getAllPlaylists } from '../../store/playlists';
import { getSongs } from '../../store/music';
import { Link } from 'react-router-dom';

function AddSongToPlaylist() {
    const dispatch = useDispatch();
    const [errors, setErrors] = useState([]);
    const user = useSelector(state => state.session.user);
    const playlists = useSelector(state => state.playlists.user_playlists);
    const songs = useSelector(state => state.music.songs);
    const [chosenPlaylistId, setChosenPlaylistId] = useState(0)
    const [songId, setSongId] = useState(0);

    const handleAddSong = async (e) => {
        e.preventDefault();
        setSongId(e.target.value);
        const songToAdd = {
            song_id: songId,
            playlist_id: chosenPlaylistId
        }
        dispatch(addSongToPlaylist(songToAdd));
    }

    useEffect(() => {
        dispatch(getAllPlaylists(user?.id));
        dispatch(getSongs());
    }, [dispatch, user?.id, chosenPlaylistId])

    return (playlists && songs) && (
        <div>
            <h1>Choose a playlist to add songs to:</h1>
            {Object.values(playlists).map((playlist) => (
                <div key={playlist.id}>
                    <h2>{playlist.name}</h2>
                    <Link to={`api/playlists/${playlist.id}`}>
                        <button>View Playlist</button>
                    </Link>
                    <select onChange={(e) => setChosenPlaylistId(e.target.value)}>
                        <option value={0}>Select a Song</option>
                        {Object.values(songs).map((song) => (
                            <option key={song.id} value={song.id}>{song.title}</option>
                        ))}
                    </select>
                    <button onClick={handleAddSong}>Add Song to Playlist</button>
                </div>
            ))}
        </div>
    )
}

export default AddSongToPlaylist;