import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import * as musicActions from "../../store/music";
import OpenModalButton from "../OpenModalButton";
import DeleteSongModal from "./delete_song_modal";
import { useModal } from "../../context/Modal";
import UploadForm from "../upload";
import {deleteAnArtist} from '../../store/music'
import { DeleteAlbumModal,DeleteArtistModal } from "./delete_song_modal";
import { Redirect, useHistory } from "react-router-dom";


import "./admin.css"

export const AdminPanel = () => {
  const dispatch = useDispatch();
  const albums = useSelector((state) => state.music.albums);
  const artists = useSelector((state) => state.music.artists);
  const songs = useSelector((state) => state.music.songs);
  const [loading, setLoading] = useState(true);
  const [openArtist, setOpenArtist] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [openAlbum, setOpenAlbum] = useState(null);
  const containerRef = useRef(null);
  const closeMenu = useModal()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  useEffect(() => {
    dispatch(musicActions.getAlbums());
    dispatch(musicActions.getAllArtistsThunk());
    dispatch(musicActions.getSongs());
    setLoading(false);
  }, []);

  

  const handleUploadFormSuccess = () => {
    setShowUploadForm(false); 
  };

  const handleArtistClick = (artistId) => {
    if (openArtist === artistId) {
      setOpenArtist(null);
    } else {
      setOpenArtist(artistId);
    }
    setOpenAlbum(null);
  };

  const handleAlbumClick = (albumId) => {
    if (openAlbum === albumId) {
      setOpenAlbum(null);
    } else {
      setOpenAlbum(albumId);
    }
  };

  const handleClickOutside = (e) => {
    const modalContainer = document.querySelector("#modalContent");
    const modalButtons = document.querySelector("#modal-content > div > div");
    if (
      containerRef.current &&
      !containerRef.current.contains(e.target) &&
      (!modalContainer || !modalContainer.contains(e.target)) &&
      (!modalButtons || !modalButtons.contains(e.target))
    ) {
      setOpenArtist(null);
      setOpenAlbum(null);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDeleteArtist =  (artistId) => {
    dispatch(deleteAnArtist(artistId))

  }


  return (
    <div className="AdminPanel" ref={containerRef}>
      <div className="AdminPanel__container">
        <div className="AdminPanel__container__left">
          <div className="AdminPanel__container__left__text">
            <h1>Admin Panel</h1>
            <h2>Here you can see all the music in the database</h2>
          </div>
        </div>
        <div className="AdminPanel__container__right">
        </div>
        <div >
          <h1>Artists</h1>
          <OpenModalButton className="upload-button"
            buttonText="Add Music"
            onItemClick={(e) => (e.preventDefault(), e.stopPropagation(), closeMenu())}
            modalComponent={<UploadForm onSuccess={handleUploadFormSuccess} />}
          ></OpenModalButton>

          <div className="AdminPanel__container__artists">
            {artists &&
              Object.values(artists).map((artist) => (
                <div className="AdminPanel__artist-entry" key={artist.id}>
                  <h2 onClick={() => handleArtistClick(artist.id)}>
                    {artist.name}
                  
                  </h2>
                  {openArtist === artist.id && (
                    <ul>
                      <h3>Albums</h3>
                      {artist.albums.map((album) => (
                        <li key={album.id}>
                          <h4 onClick={() => handleAlbumClick(album.id)}>
                            {album.name}
                            <OpenModalButton
                                    buttonText="X"
                                    onItemClick={(e) => (e.preventDefault(), e.stopPropagation(), closeMenu())}
                                    modalComponent={<DeleteAlbumModal albumId={album.id} />}
                                  >

                                  </OpenModalButton>
                          </h4>
                          {openAlbum === album.id && (
                            <div className="album_entry">
                            <ul>
                              {album.songs.map((song) => (
                                <li key={song.id}>{song.title}
                                  <OpenModalButton
                                    buttonText="X"
                                    onItemClick={(e) => (e.preventDefault(), e.stopPropagation(), closeMenu())}
                                    modalComponent={<DeleteSongModal songId={song.id} albumId={album.id} artistId={artist.id}/>}
                                  >

                                  </OpenModalButton>
                                </li>
                              ))}
                            </ul>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;