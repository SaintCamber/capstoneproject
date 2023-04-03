import React from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { UpdateSongThunk, deleteASong, deleteAnAlbum, deleteAnArtist } from "../../store/music";
import "./DeleteSongModal.css";
import {useState} from 'react'

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

export function UpdateSongModal(song) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [title, setTitle] = useState('')
    const [Errors, setErrors] = useState([]);
    console.log(song, 'song in update song modal')
    const handleUpdate = (event) => {
      event.preventDefault();
      let errors = [];
      setErrors([])
      if (!title) errors.push('Please provide a title for the song.');
      if (title.length > 50) errors.push('Song title must be less than 50 characters.');
      if (title.length < 1) errors.push('Song title must be at least 1 character.');
      const formData = new FormData();
      if (errors.length) return setErrors(errors);
      formData['title']= title;
      dispatch(UpdateSongThunk(song.song.id, formData));
      console.log(song.song.id, 'song id in update song modal')
      console.log(formData, 'form data in update song modal')
      closeModal();
    };
  
    const handleNameChange = (event) => {
      setTitle(event.target.value);
    };
  
    return (
      <div className="UpdateSongModal">
        <h1>Update Song Info</h1>
        <form onSubmit={handleUpdate}>
            <div>{Errors.map(error=><p>{error}</p>)}</div>
          <label htmlFor="name">Title:</label>
          <input type="text" id="name" value={title} onChange={handleNameChange} />
          <button type="submit">Update</button>
        </form>
      </div>
    );
  }