import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getSinglePlaylist } from '../../store/playlists';
import { chooseSong } from '../../store/music';
import SongCard from '../SongRow';
import AddSongToPlaylist from './addSongToPlaylist';

function PlaylistPage() {
    const dispatch = useDispatch();
    const { id } = useParams();

    const playlist = useSelector(state => state.playlists.singlePlaylist);
    const songs = useSelector(state => state.music.songs);
    const [showAddSongs, setShowAddSongs] = useState(false);

    useEffect(() => {
        dispatch(getSinglePlaylist(id));
    }, [dispatch, id]);

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])


    const handleChooseSong = (song) => {
        dispatch(chooseSong(song.file_url));
    };

    const handleShowAllSongs = (e) => {
        e.preventDefault();
        setShowAddSongs(!showAddSongs);
    };

    return (
        <>
            {playlist && (
                <div>
                    <img src="../../../public/default_image.PNG" alt="Album Art" />

                    <div>
                        <h3>{playlist.name}</h3>
                    </div>
                </div>
            )}

            <div>
                {playlist?.songs.map((song, index) => (
                    <div key={song.id}>
                        <p>{index + 1}</p>
                        <SongCard
                            song={song}
                            handleChooseSong={handleChooseSong}
                        />
                    </div>
                ))}
                <button onClick={handleShowAllSongs}>Add Songs</button>
                {showAddSongs && <AddSongToPlaylist playlistId={playlist.id} />}
            </div>
        </>
    );
}

export default PlaylistPage;
