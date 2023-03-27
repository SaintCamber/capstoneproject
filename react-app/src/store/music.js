
const PLAY = "music/play";
const PAUSE = "music/pause";
const STOP = "music/stop";
const LOAD_SONG = "music/loadSong";
const GET_SONGS = "music/getSongs";
const GET_ALBUMS = "music/getAlbums";


export const playSong = () => ({
  type: PLAY,
});

export const pauseSong = () => ({
  type: PAUSE,
});

export const stopSong = () => ({
  type: STOP,
});

export const loadSong = (songUrl) => ({
  type: LOAD_SONG,
  payload: songUrl,
});

export const getAllSongs = (songs) => ({
  type: GET_SONGS,
  payload: songs,
});

export const getAllAlbums = (albums) => ({
  type: GET_ALBUMS,
  payload: albums,
});



// thunk for choosing a song
export const chooseSong = (songUrl) => async (dispatch) => {
  dispatch(loadSong(songUrl));
  dispatch(playSong());
};

// get all songs from the database
export const getSongs = () => async (dispatch) => {
  const response = await fetch("/api/playlists/songs");
  const data = await response.json();
  console.log(data, "response from getSongs thunk")
  dispatch(getAllSongs(data));
  return data;
};

// get all albums from the database
export const getAlbums = () => async (dispatch) => {
  const response = await fetch("/api/playlists/albums");
  const data = await response.json();
  console.log(data, "response from getAlbums thunk")
  dispatch(getAllAlbums(data));
  return data;
};


const initialState = {
  isPlaying: false,
  chosenSong: null,
  songs: {},
};

const music = (state = initialState, action) => {
  switch (action.type) {
    case PLAY:
      return {
        ...state,
        isPlaying: true,
      };
    case PAUSE:
      return {
        ...state,
        isPlaying: false,
      };
    case STOP:
      return {
        ...state,
        isPlaying: false,
      };
    case LOAD_SONG:
      return {
        ...state,
        chosenSong: { ...action.payload },
      };

    case GET_SONGS:
      return {
        ...state,
        songs: { ...action.payload },
      };

    case GET_ALBUMS:
      return {
        ...state,
        albums: { ...action.payload },
      };
      
    default:
      return state;
  }
};


export default music;