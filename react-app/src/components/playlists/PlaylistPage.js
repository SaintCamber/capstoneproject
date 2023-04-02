import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getSinglePlaylist } from "../../store/playlists";
import DeletePlaylistModal from "./deletePlaylistmodal";
import { useModal } from "../../context/Modal";
import OpenModalButton from "../OpenModalButton";
import delete_song_modal from "../adminPages/delete_song_modal";
import { useHistory } from "react-router-dom";
import SongRow from "../SongRow";
import "./PlaylistPage.css";

const PlaylistPage = () => {
    const { PlaylistId } = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const playlist = useSelector((state) => state.playlists.singlePlaylist);
    const songs = useSelector((state) => state.playlists.singlePlaylist.songs);
    const [errors, setErrors] = useState([]);
    const user = useSelector((state) => state.session.user);
    const closeMenu = useModal();
    const addSongs = (e) => {
        e.preventDefault();
        return history.push(`/add/${PlaylistId}`);
    }

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
            <div className="PlaylistPage__buttons">
            <div className="buttonDelete">
            <OpenModalButton
                className="deletePlaylistButton"
                buttonText={"X"}
                modalComponent={<DeletePlaylistModal PlaylistId={PlaylistId} />}/>

            </div>
            <div className="buttonAdd">

            <button className="addButton" onClick={addSongs}>+</button>
            </div>
            </div>
            {songs && Object.values(songs).map((song) => (
                <SongRow key={song?.id} song={song} PlaylistId={PlaylistId} />
            ))}
        </div>
    );
};

export default PlaylistPage;
