import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef, forwardRef } from "react";
import * as musicActions from "../../store/music";
import OpenModalButton from "../OpenModalButton";
import { useModal } from "../../context/Modal";
import { addSongToPlaylist } from "../../store/playlists";
import { getSinglePlaylist } from "../../store/playlists";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom"

import "../adminPages/admin.css"

export const AddSongs = () => {
    const dispatch = useDispatch();
    const history = useHistory()
    const { PlaylistId } = useParams()
    const albums = useSelector((state) => state.music.albums);
    const artists = useSelector((state) => state.music.artists);
    const songs = useSelector((state) => state.music.songs);
    const playlist = useSelector((state) => state.playlists.singlePlaylist);

    const [loading, setLoading] = useState(true);
    const [openArtist, setOpenArtist] = useState(null);
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
        dispatch(getSinglePlaylist(PlaylistId));
        setLoading(false);
    }, []);


    const handleAddToPlaylist = (song) => {
        console.log(song, "song in handleAddToPlaylist", PlaylistId, "playlistId in handleAddToPlaylist")
        dispatch(addSongToPlaylist(song, PlaylistId))

    }


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
        const modalContainer = document.querySelector(".ReactModal__Overlay");
        if (
            containerRef.current &&
            !containerRef.current.contains(e.target) &&
            (!modalContainer || !modalContainer.contains(e.target))
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

    return (
        <div className="AdminPanel" ref={containerRef}>
            <div className="AdminPanel__container">
                <div className="AdminPanel__container__left">
                    <div className="AdminPanel__container__left__text">
                    </div>
                </div>
                <div className="AdminPanel__container__right">
                    <img src="https://i.imgur.com/8QZQY0C.png" alt="songify logo" />
                </div>
                <h1>Add Songs to your playlist!</h1>
                <h5 onClick={() => { history.push(`/playlists/${PlaylistId}`) }}>Done Adding Songs</h5>
                <div>
                    <h1>Artists</h1>
                    <div className="AdminPanel__container__artists">
                        {artists &&
                            Object.values(artists).map((artist) => (
                                <div key={artist.id}>
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
                                                    </h4>
                                                    {openAlbum === album.id && (
                                                        <ul>
                                                            {album.songs.map((song) => (
                                                                <>
                                                                    <li key={song.id}>{song.title}
                                                                    </li>
                                                                    <button className="addButton" onClick={() => handleAddToPlaylist(song)}>+</button>
                                                                </>))}
                                                        </ul>
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

export default AddSongs;