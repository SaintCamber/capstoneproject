import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPlaylists } from '../../store/playlists';
import { getAllSongs } from '../../store/music';
import { useHistory } from 'react-router-dom';

export default function SideBar() {
    const user = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const history = useHistory();
    const userPlaylists = useSelector(state => state.playlists.user_playlists)
    const songs = useSelector(state => state.music.songs);

    useEffect(() => {
        if (user) {
            dispatch(getAllSongs());
            dispatch(getAllPlaylists());
        }
    }, [dispatch, user])

    if (!user) {
        return (
            <div className="SideBar">
                <h1>Songify</h1>
                <div>
                    <p>Log in to see your playlists</p>
                </div>
            </div>
        )
    }

    return (
        <div className="SideBar">
            <h1 onClick={() => history.push('/')}>Songify</h1>
            <Link to={"/newPlaylist"}>Create a Playlist</Link>
            <h2>Playlists</h2>
            <ul>
                {Object.values(userPlaylists).map((playlist) => {
                    return <li key={playlist.id}>{playlist.name}</li>
                })}
            </ul>
        </div>
    )
}