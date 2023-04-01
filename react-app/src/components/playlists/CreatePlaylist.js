import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNewPlaylist, getAllPlaylists } from '../../store/playlists';
import { useHistory } from 'react-router-dom';
import "./createPlaylist.css"

function CreatePlaylist() {
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [errors, setErrors] = useState([]);
    const user = useSelector(state => state.session.user);
    const playlists = useSelector(state => state.playlists.user_playlists);
    const history = useHistory();

    useEffect(() => {
        window.scrollTo(0, 0)
    }, []);

    useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

    useEffect(() => {
        if (!user) {
            return
        }
        dispatch(getAllPlaylists(user?.id));
    }, [dispatch, user?.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const playlist = {
            name: name,
            user_id: user.id
        }
        let newPlaylist = await dispatch(createNewPlaylist(playlist));
        setName('');
        history.push(`/playlists/${newPlaylist.id}`)
    }

    return (
        <div className="create-playlist-container">
            <div className="create-playlist-header">
                <h1>Create Playlist</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="playlist-name">Playlist Name</label>
                    <input
                        type='text'
                        id="playlist-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-actions">
                    <button type='submit'>Create</button>
                    <button>Cancel</button>
                </div>
            </form>
        </div>
    )
}

export default CreatePlaylist;
