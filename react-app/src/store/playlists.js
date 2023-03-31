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



const add_song_to_playlist = (playlistId, song) => ({
    type: ADD_SONG_TO_PLAYLIST,
    payload: { playlistId, song }
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


export const addSongToPlaylist = (song, playlistId) => async (dispatch) => {
    console.log(song, playlistId, "song, playlistId")
    const res = await fetch(`/api/playlists/addSong/${playlistId}`, {
        method: 'POST',
        headers: { "content-type": 'application/json' },
        body: JSON.stringify({ song, playlistId })
    });
    const data = await res.json();
    console.log(data, "data from addSongToPlaylist")
    dispatch(add_song_to_playlist(data));
    return data;


}
export const removeSongFromPlaylist = (playlistId, songId) => async (dispatch) => {
    try {
        const response = await fetch(`/api/playlists/${playlistId}/songs/${songId}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        dispatch({
            type: REMOVE_SONG_FROM_PLAYLIST,
            payload: data,
        });
    } catch (error) {
        console.error(error);
    }
};



export const playPlaylistThunk = (playlistId) => async (dispatch) => {
    const res = await fetch(`/api/playlists/${playlistId}`);
    const data = await res.json();
    dispatch(readSinglePlaylist(data));
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
            console.log(action.payload, "action.payload in READ_PLAYLISTS")
            let newState = { ...state };
            action.payload.forEach(playlist => {
                newState.user_playlists[playlist.id] = playlist;

            })
            return newState;
        case READ_SiNGLE_PLAYLIST:
            console.log(action.payload, "action.payload in READ_SiNGLE_PLAYLIST")
            return {
                ...state,
                singlePlaylist: action.payload
            }


        case REMOVE_SONG_FROM_PLAYLIST:
            return {
                ...state,
                singlePlaylist: {
                    ...state.singlePlaylist,
                    songs: state.singlePlaylist.songs.filter((song) => song.id !== action.payload.id),
                },
            };
        case ADD_SONG_TO_PLAYLIST:
            return {
                ...state,
                singlePlaylist: {
                    ...state.singlePlaylist,
                    songs: [...state.singlePlaylist.songs, action.payload.song]
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