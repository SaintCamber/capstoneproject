import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getSongs } from "../../store/music";
import { getSinglePlaylist } from "../../store/playlists";
import SongRow from "../SongRow";
import "./PlaylistPage.css";

const PlaylistPage = () => {
    const dispatch = useDispatch();
    const Playlist = useSelector((state) => state.playlists.SinglePlaylist);
    const [errors, setErrors] = useState([]);
    const user = useSelector((state) => state.session.user);
    const songs = Playlist?.songs;
    const { PlaylistId } = useParams();


    useEffect(() => {
        dispatch(getSinglePlaylist(PlaylistId));
        dispatch(getSongs());
    }, [dispatch, PlaylistId]);

    return (
        <div className="PlaylistPage">
            {Playlist && (
                <div className="PlaylistPage__top">
                    <div className="PlaylistPage__art">
                        {Playlist?.art ? (
                            <img src={Playlist?.art} alt="Playlist art" />
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
                    <div className="PlaylistPage__details">
                        <h1>{Playlist?.name}</h1>
                        <h2>{Playlist?.artist}</h2>
                        <h3>{songs?.length} Songs</h3>
                    </div>
                </div>
            )}
            <div className="PlaylistPage__songs">
                {songs?.map((song, i = 1) => {

                    return <SongRow key={i} song={song} trackNumber={++i} />
                })}
            </div>
        </div>
    );
};

export default PlaylistPage;
