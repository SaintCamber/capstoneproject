import React from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./DeletePlaylistModal.css";
import { deletePlaylistThunk, getAllPlaylists } from "../../store/playlists";
import { useHistory } from "react-router-dom";

function DeletePlaylistModal({ PlaylistId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const history = useHistory();

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation()
    dispatch(deletePlaylistThunk(PlaylistId));
    closeModal();
    history.push("/");
    
  };

  return (
    <div className="delete-playlist-modal" onClick={(e) => e.stopPropagation()}>
      <h2 className="delete-playlist-modal__title">Delete playlist</h2>
      <p className="delete-playlist-modal__message">
        Are you sure you want to delete this playlist?
      </p>
      <div className="delete-playlist-modal__buttons">
        <button className="delete-playlist-modal__cancel-button" onClick={() => closeModal()}>
          Cancel
        </button>
        <button className="delete-playlist-modal__delete-button" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default DeletePlaylistModal;
