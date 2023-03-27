import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getSinglePlaylist } from '../../store/playlists';
import { chooseSong } from '../../store/music';
import SongCard from '../SongCard';
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

    const albumArt = playlist?.songs[0]?.album_art_url || 'default_image_url';

    const handleChooseSong = (song) => {
        dispatch(chooseSong(song.file_url));
    };

    const handleShowAllSongs = (e) => {
        e.preventDefault();
        setShowAddSongs(!showAddSongs);
    }


    return (
        <>
            <div>
                <img src={albumArt} alt="Album Art" />

                <div>
                    <h3>{playlist?.name}</h3>
                    <p>{playlist?.artist}</p>
                </div>
            </div>

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
                <button onClick={setShowAddSongs}>Add Songs</button>
                {showAddSongs ? <AddSongToPlaylist playlistId={playlist.id} /> : ""}
            </div>
        </>
    );
}

export default PlaylistPage;
