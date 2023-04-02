import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link, redirect } from 'react-router-dom';
import { getAllPlaylists, getSinglePlaylist } from '../../store/playlists';
import { getAllSongs } from '../../store/music';
import { useHistory } from 'react-router-dom';
import './SideBar.css';

export default function SideBar() {
    const user = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const history = useHistory();
    const userPlaylists = useSelector(state => state.playlists.user_playlists);
    const songs = useSelector(state => state.music.songs);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        dispatch(getAllSongs());
        dispatch(getAllPlaylists())
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
    }, [dispatch, user]);

    console.log(userPlaylists, 'user playlists in the sidebar');
    const playlistClick = (e, id) => {
        e.preventDefault();
        dispatch(getSinglePlaylist(id));
        console.log(id, 'id in the playlist click');
        history.push(`/playlists/${id}`)
    };
    if (!user) {
        return (
            <div className="SideBar">
                <h1 onClick={() => history.push('/')}>Songify</h1>
                <div className="SideBar__navItem">
                    <p>Log in to continue</p>
                </div>
            </div>
        );
    }

    return (
        <div className="SideBar">
            <h1 onClick={() => history.push('/')}>Songify</h1>
            <div className="SideBar__navContainer">
            <div className="SideBar__navItem" onClick={() => history.push('/')}>
                <i className="fas fa-home"></i>
                <span>Home</span>
            </div>
            <div className="SideBar__navItem" onClick={(e) => {
                e.preventDefault();
                return alert('Feature coming soon please try again later');
            }}>
                <i className="fas fa-search"></i>
                <span>Search</span>
            </div>
            <div className="SideBar__navItem" onClick={() => alert("Library coming soon! please pick a playlist instead!")}>
                <i className="fas fa-book"></i>
                <span>Your Library</span>
            </div>
            <Link to={"/newPlaylist"} className="SideBar__navItem">
                <i className="fas fa-plus"></i>
                <span>Create a Playlist</span>
            </Link></div>

            <div className="SideBar__playlist-container">
                <div className="Scrollable">
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        userPlaylists && Object.values(userPlaylists).map((playlist) => {
                            return (
                                <div key={playlist?.id} onClick={(e) => playlistClick(e, playlist?.id)}>
                                    <div className="SideBar__playlistEntry">{playlist?.name}</div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <div className="SideBar__devInfo">
                <p>Developed by: Sarah Nodwell</p>
                <><Link className="Links" to={{ pathname: "https://www.linkedin.com/in/sarah-nodwell-77a171217" }} target="_blank">linkedin</Link></>
                <><Link className="Links" to={{ pathname: "https://github.com/SaintCamber" }} target="_blank">github</Link></>
            </div>
        </div>
    )
}

