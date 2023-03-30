import React from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteSong } from "../../store/songs";
import "./DeleteSongModal.css";

function DeleteSongModal({ songId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = async (e) => {
        e.preventDefault();
        await dispatch(deleteSong(songId));
        closeModal();
    };

    return (
        <div className="delete-song-modal">
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

export default DeleteSongModal;