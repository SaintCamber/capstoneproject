import React from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteASong, deleteAnAlbum, deleteAnArtist,updateSong } from "../../store/music";
import "./DeleteSongModal.css";

function DeleteSongModal({ songId,albumId,artistId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = (e) => {
        e.preventDefault();
        e.stopPropagation()
        dispatch(deleteASong(songId,albumId,artistId));
        closeModal();
    };
    return (
        <div className="delete-song-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Delete Song</h2>
            <p>Are you sure you want to delete this song?</p>
            <div className="delete-song-modal-buttons">
                <button className="cancel-button" onClick={() => closeModal()}>
                    Cancel
                </button>
                <button className="delete-button" onClick={handleDelete}>
                    Delete
                </button>
            </div>
        </div>
    );
}



export function DeleteAlbumModal({ albumId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    
    const handleDeleteAlbum = (e) => {
        e.preventDefault();
        e.stopPropagation()
        dispatch(deleteAnAlbum(albumId));
        closeModal();}
    return (
        <div className="delete-song-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Delete album</h2>
            <p>Are you sure you want to delete this album?</p>
            <div className="delete-song-modal-buttons">
                <button className="cancel-button" onClick={() => closeModal()}>
                    Cancel
                </button>
                <button className="delete-button" onClick={handleDeleteAlbum}>
                    Delete
                </button>
            </div>
        </div>
    );
}
export default DeleteSongModal;


export function DeleteArtistModal({ artistId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = (e) => {
        e.preventDefault();
        e.stopPropagation()
        dispatch(deleteAnArtist(artistId));
        closeModal();
    };
    
    return (
        <div className="delete-song-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Delete Artist</h2>
            <p>Are you sure you want to delete this artist?</p>
            <div className="delete-song-modal-buttons">
                <button className="cancel-button" onClick={() => closeModal()}>
                    Cancel
                </button>
                <button className="delete-button" onClick={handleDelete}>
                    Delete
                </button>
            </div>
        </div>
    );
}
export function UpdateSongModal(songId){
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    return(
        <div className="UpdateSongModal">
            <h1>Update Song Info</h1>
            <form></form>
        </div>
    )


}