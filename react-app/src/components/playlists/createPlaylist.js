import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNewPlaylist,getAllPlaylists } from '../../store/playlists';



export default function CreatePlaylist() {
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [errors, setErrors] = useState([]);
    const user = useSelector(state => state.session.user);
    const playlists = useSelector(state => state.playlists.user_playlists);

    useEffect(() => {
        if (!user) {
            return
        }
        dispatch(getAllPlaylists(user?.id));
    }, [dispatch, user?.id])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const playlist = {
            name: name,
            user_id: user.id
        }
        dispatch(createNewPlaylist(playlist));
        setName('');
    }


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <button type='submit'>Create Playlist</button>
            </form>
        </div>
    )
}

