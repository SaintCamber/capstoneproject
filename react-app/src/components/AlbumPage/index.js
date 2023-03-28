import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getSingleAlbum, getSongs } from "../../store/music";
import SongRow from "../SongRow";
import "./AlbumPage.css";

const AlbumPage = () => {
    const dispatch = useDispatch();
    const album = useSelector((state) => state.music.currentAlbum);
    const [errors, setErrors] = useState([]);
    const user = useSelector((state) => state.session.user);
    const songs = album.songs;
    const { albumId } = useParams();


    useEffect(() => {
        dispatch(getSingleAlbum(albumId));
        dispatch(getSongs());
    }, [dispatch, albumId]);

    return (
        <div className="AlbumPage">
            {album && (
                <div className="AlbumPage__top">
                    <div className="AlbumPage__art">
                        {album?.art ? (
                            <img src={album?.art} alt="album art" />
                        ) : (
                            <svg
                                role="img"
                                height="64"
                                width="64"
                                aria-hidden="true"
                                data-testid="card-image-fallback"
                                viewBox="0 0 24 24"
                                data-encore-id="icon"
                                className="Svg-sc-ytk21e-0 gQUQL"
                            >
                                <path d="M6 3h15v15.167a3.5 3.5 0 1 1-3.5-3.5H19V5H8v13.167a3.5 3.5 0 1 1-3.5-3.5H6V3zm0 13.667H4.5a1.5 1.5 0 1 0 1.5 1.5v-1.5zm13 0h-1.5a1.5 1.5 0 1 0 1.5 1.5v-1.5z"></path>
                            </svg>
                        )}
                    </div>
                    <div className="AlbumPage__details">
                        <h1>{album?.name}</h1>
                        <h2>{album?.artist}</h2>
                        <h3>{songs?.length} Songs</h3>
                    </div>
                </div>
            )}
            <div className="AlbumPage__songs">
                {songs?.map((song, i=1) => {

                    return <SongRow key={i} song={song} trackNumber={++i} />
                })}
            </div>
        </div>
    );
};

export default AlbumPage;
