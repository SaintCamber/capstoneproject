import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { chooseSong } from '../../store/music';

function SongCard(song) {
    const dispatch = useDispatch();

    const handleChooseSong = (song) => {
        dispatch(chooseSong(song.file_url));
    };




    return (
        <div>

            <div key={song.id}>
                <div>
                    <h3>{song.title}</h3>
                    <p>{song.artist}</p>
                </div>
                <p>{song.album}</p>
                <button onClick={handleChooseSong(song)}>play</button>
            </div>

        </div>

    )
}

export default SongCard;