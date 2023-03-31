import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getSinglePlaylist } from "../../store/playlists";
import SongRow from "../SongRow";
import "./PlaylistPage.css";

const PlaylistPage = () => {
    const { PlaylistId } = useParams();
    const dispatch = useDispatch();
    const playlist = useSelector((state) => state.playlists.singlePlaylist);
    const songs = useSelector((state) => state.playlists.singlePlaylist.songs);
    const [errors, setErrors] = useState([]);
    const user = useSelector((state) => state.session.user);


    useEffect(() => {
        console.log(playlist, "playlist in the playlist page");
        dispatch(getSinglePlaylist(PlaylistId));
    }, [dispatch, PlaylistId]);

    if (!playlist) {
        return null;
    }

    return (
        <div className="PlaylistPage">
            <div className="PlaylistPage__header">
                <h1>{playlist?.name}</h1>
                {playlist?.user && <p>Created by {playlist.user.username}</p>}
            </div>
            {songs && Object.values(songs).map((song) => (
                <SongRow key={song.id} song={song} PlaylistId={PlaylistId} />
            ))}
        </div>
    );
};

export default PlaylistPage;