
initialState = { chosenSong: {},PlaylistSongs: {}, Playlist: {}, PlaylistName: '' , PlaylistId: '' };
// action creator for adding songs to the playbar, and choosing songs from
export function addSongToPlaybar(song) {
  return {
    type: "ADD_SONG_TO_PLAYBAR",
    song,
  };
}

//thunk for  adding songs to the playbar
export function addSongToPlaybarThunk(song) {
  return function (dispatch) {
    // accept a song as a parameter, and dispatch the action creator to add the song to the playbar.
    dispatch(addSongToPlaybar(song));
  };
}
export default function music(state=initialState,action){
    switch (action.type) {
      case "ADD_SONG_TO_PLAYBAR":
        return { ...state, chosenSong: action.song };
      case "ADD_PLAYLIST_SONGS":
        return { ...state, PlaylistSongs: action.PlaylistSongs };
      case "ADD_PLAYLIST":
        return { ...state, Playlist: action.Playlist };
      case "ADD_PLAYLIST_NAME":
        return { ...state, PlaylistName: action.PlaylistName };
      case "ADD_PLAYLIST_ID":
        return { ...state, PlaylistId: action.PlaylistId };
      case "REMOVE_SONG_FROM_PLAYLIST":
        return { ...state, PlaylistSongs: action.PlaylistSongs };
      case "REMOVE_SONG_FROM_PLAYLIST_THUNK":
        return { ...state, PlaylistSongs: action.PlaylistSongs };
      case "REMOVE_SONG_FROM_PLAYLIST_THUNK_2":
        return { ...state, PlaylistSongs: action.PlaylistSongs };
      default:
        return state;
    }
}