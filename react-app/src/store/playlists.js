let CREATE_PLAYLIST = 'playlists/CREATE_PLAYLIST';
let READ_PLAYLISTS = 'playlists/READ_PLAYLISTS';
let DELETE_PLAYLIST = 'playlists/DELETE_PLAYLIST';
let REMOVE_SONG_FROM_PLAYLIST = 'playlists/REMOVE_SONG_FROM_PLAYLIST';
let ADD_SONG_TO_PLAYLIST = 'playlists/ADD_SONG_TO_PLAYLIST';
let READ_SiNGLE_PLAYLIST = 'playlists/READ_SiNGLE_PLAYLIST';


const createPlaylist = (playlist) => ({
    type: CREATE_PLAYLIST,
    payload: playlist
});

const getPlaylists = (playlists) => ({
    type: READ_PLAYLISTS,
    payload: playlists
});

const readSinglePlaylist = (playlist) => ({
    type: READ_SiNGLE_PLAYLIST,
    payload: playlist
})

const remove_song_from_playlist = (playlist, song_id) => ({
    type: REMOVE_SONG_FROM_PLAYLIST,
    payload: { playlist, song_id }
})

const add_song_to_playlist = (playlist, song) => ({
    type: ADD_SONG_TO_PLAYLIST,
    payload: { playlist, song }
})
const deletePlaylist = (playlist) => ({
    type: DELETE_PLAYLIST,
    payload: playlist
});


export const createNewPlaylist = (playlist) => async (dispatch) => {
    const res = await fetch('/api/playlists/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(playlist)
    });
    const data = await res.json();
    dispatch(createPlaylist(data));
    return data;
}

export const getAllPlaylists = () => async (dispatch, getState) => {
    const user = getState().session.user;
    if (user) {
        const res = await fetch(`/api/playlists/user`);
        const data = await res.json();
        console.log(data, "data from getAllPlaylists");
        dispatch(getPlaylists(data));
        return data;
    }
};

export const getSinglePlaylist = (playlistId) => async (dispatch) => {
    const res = await fetch(`/api/playlists/${playlistId}`);
    const data = await res.json();
    dispatch(readSinglePlaylist(data));
    return data;
}


export const deletePlaylistThunk = (playlistId) => async (dispatch) => {
    const res = await fetch(`/api/playlists/${playlistId}`, {
        method: 'DELETE',
        headers: { "content-type": 'application/json' },
    });
    const data = await res.json();
    dispatch(deletePlaylist(data));
    return data;
}


export const addSongToPlaylist = (songToAdd) => async (dispatch) => {
    let { song_id, playlist_id } = songToAdd;
    const res = await fetch(`/api/playlists/${songToAdd["playlist_Id"]}`, {
        method: 'POST',
        headers: { "content-type": 'application/json' },
        body: JSON.stringify({ song_id, playlist_id })
    });
    const data = await res.json();
    dispatch(getPlaylists(data));
    return data;

}

export const removeSongFromPlaylist = (songToRemove) => async (dispatch) => {
    const res = await fetch('/api/playlists/${songToRemove.playlist_id}/removesong', {
        method: 'DELETE',
        headers: { "content-type": 'application/json' },
        body: JSON.stringify(songToRemove)
    });
    const data = await res.json();
    dispatch(getPlaylists(data));
    return data;
}






const initialState = { user_playlists: {}, singlePlaylist: {} }

const playlists = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_PLAYLIST:
            console.log(action.payload, 'action.payload in playlists reducer')
            return {
                ...state,
                user_playlists: { ...state.user_playlists, [action.payload.id]: action.payload }
            }
        case READ_PLAYLISTS:
            let newState = { ...state };
            action.payload.forEach(playlist => {
                newState.user_playlists[playlist.id] = playlist;

            })
            return newState;
        case READ_SiNGLE_PLAYLIST:
            return {
                ...state,
                singlePlaylist: action.payload
            }


        case REMOVE_SONG_FROM_PLAYLIST:

            return {
                ...state,
                user_playlists: {
                    ...state.user_playlists,
                    [action.payload.playlist.id]: {
                        ...state.user_playlists[action.payload.playlist.id],
                        songs: state.user_playlists[action.payload.playlist.id].songs.filter(song => song.id !== action.payload.song_id)
                    }
                }
            }
        case ADD_SONG_TO_PLAYLIST:
            return {
                ...state,
                user_playlists: {
                    ...state.user_playlists,
                    [action.payload.playlist.id]: {
                        ...state.user_playlists[action.payload.playlist.id],
                        songs: [...state.user_playlists[action.payload.playlist.id].songs, action.payload.song]
                    }
                }
            }
        case DELETE_PLAYLIST:
            let newState2 = { ...state };
            delete newState2.user_playlists[action.payload.id];
            return newState2;
        default:
            return state;
    }
}


export default playlists;