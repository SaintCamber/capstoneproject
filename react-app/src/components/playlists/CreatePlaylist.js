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

    const validate = () => {
        const errors = [];

        if (name.length < 7) {
            errors.push("Playlist name must be at least 7 characters long");
        }

        if (!/^[a-zA-Z\s]+$/.test(name)) {
            errors.push("Playlist name must not contain special characters or numbers");
        }

        if (name.length > 30) {
            errors.push("Playlist name cannot exceed 30 characters");
        }

        setErrors(errors);
        return errors.length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            const playlist = {
                name: name,
                user_id: user.id
            }
            let newPlaylist = await dispatch(createNewPlaylist(playlist));
            setName('');
            history.push(`/playlists/${newPlaylist.id}`)
        }
    }

    return (
        <div className="create-playlist-container">
            <div className="create-playlist-header">
                <h1>Create Playlist</h1>
            </div>
            {errors.length > 0 && (
                <div className="form-errors">
                    <ul>
                        {errors.map((error, idx) => (
                            <li key={idx}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
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
