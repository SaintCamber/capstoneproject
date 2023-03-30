import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getSinglePlaylist } from '../../store/music';

function PlaylistCard({ playlist }) {
    const history = useHistory();
    const dispatch = useDispatch();

    const handleCardClick = (e) => {
        e.preventDefault();
        dispatch(getSinglePlaylist(playlist.id));
        history.push(`/playlists/${playlist.id}`);
    };

    return (
        <div className="PlaylistCard" onClick={handleCardClick}>
            <div className="PlaylistCard__art">
                {playlist?.playlist_art ? (
                    <img src={playlist?.playlist_art} alt={`Playlist art for ${playlist}`} />
                ) : (
                    <div className="PlaylistCard__art-placeholder">
                        <img src="https://f005.backblazeb2.com/file/capstonestorage/default_image.PNG" alt="Playlist art placeholder" />
                    </div>
                )}
            </div>
            <div className="PlaylistCard__details">
                <h3>{playlist?.name}</h3>
                <p>{playlist?.artist}</p>
            </div>
        </div>
    );
}

export default PlaylistCard;