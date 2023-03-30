const PLAY = "music/play";
const PAUSE = "music/pause";
const STOP = "music/stop";
const LOAD_SONG = "music/loadSong";
const GET_SONGS = "music/getSongs";
const GET_ALBUMS = "music/getAlbums";
const GET_ARTISTS = "music/getArtists";
const GET_SINGLE_ALBUM = "music/getSingleAlbum";
const DELETE_SONG = "music/deleteSong";
const DELETE_ALBUM = "music/deleteAlbum";
const DELETE_ARTIST = "music/deleteArtist";


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

export const deleteSong = (songId) => ({
  type: DELETE_SONG,
  payload: songId,
});

export const deleteAlbum = (albumId) => ({
  type: DELETE_ALBUM,
  payload: albumId,
});

export const deleteArtist = (artistId) => ({
  type: DELETE_ARTIST,
  payload: artistId,
});







export const getAllAlbums = (albums) => ({
  type: GET_ALBUMS,
  payload: albums,
});

export const getSingleAlbum = (album) => ({
  type: GET_SINGLE_ALBUM,
  payload: album
})

export const getArtists = (artists) => ({
  type: GET_ARTISTS,
  payload: artists
})

export const updateAlbum = (albumId, updatedAlbumData) => async (dispatch) => {
  try {
    const response = await fetch(`/api/admin/albums/${albumId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedAlbumData),
    });

    const data = await response.json();

    dispatch(getAlbums());

    return data;
  } catch (error) {
    console.log("Error updating album: ", error);
  }
};

export const updateArtist = (artistId, updatedArtistData) => async (dispatch) => {
  try {
    const response = await fetch(`/api/admin/artists/${artistId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedArtistData),
    });

    const data = await response.json();

    dispatch(getArtists());

    return data;
  } catch (error) {
    console.log("Error updating artist: ", error);
  }
};

export const getSingleArtist = (artistId) => async (dispatch) => {
  const response = await fetch(`/api/admin/artists/${artistId}`);
  const data = await response.json();
  console.log(data, "response from getSingleArtist thunk")
  dispatch(getArtists(data));
  return data;
};



export const updateSong = (songId, updatedSongData) => async (dispatch) => {
  try {
    const response = await fetch(`/api/admin/songs/${songId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedSongData),
    });

    const data = await response.json();

    dispatch(getSongs());

    return data;
  } catch (error) {
    console.log("Error updating song: ", error);
  }
};



export const deleteASong = (songId) => async (dispatch) => {
  const response = await fetch(`/api/admin/songs/${songId}`, {
    method: "DELETE",
  });
  const data = await response.json();
  dispatch(deleteSong(songId));
  return data;
};
export const deleteAnAlbum = (albumId) => async (dispatch) => {
  const response = await fetch(`/api/admin/albums/${albumId}`, {
    method: "DELETE",
  });
  const data = await response.json();
  dispatch(deleteAlbum(albumId));
  return data;
}



export const deleteAnArtist = (artistId) => async (dispatch) => {
  const response = await fetch(`/api/admin/artists/${artistId}`, {
    method: "DELETE",
  });
  const data = await response.json();
  dispatch(deleteArtist(artistId));
  return data;
}




// thunk for choosing a song
export const chooseSong = (songUrl) => async (dispatch) => {
  dispatch(loadSong(songUrl));
  dispatch(playSong());
};

// get all songs from the database
export const getSongs = () => async (dispatch) => {
  const response = await fetch("/api/admin/songs/all");
  const data = await response.json();
  console.log(data, "response from getSongs thunk")
  dispatch(getAllSongs(data));
  return data;
};

// get all albums from the database
export const getAlbums = () => async (dispatch) => {
  const response = await fetch("/api/admin/albums/all");
  const data = await response.json();
  console.log(data, "response from getAlbums thunk")
  dispatch(getAllAlbums(data));
  return data;
};
export const getAllArtistsThunk = () => async (dispatch) => {
  const response = await fetch("/api/admin/artists/all");
  const data = await response.json();
  dispatch(getArtists(data));
  return data;
}


export const createNewSong = (song) => async (dispatch) => {
  const response = await fetch("/api/admin/songs", {
    method: "POST",
    headers: {

      "Content-Type": "application/json",
    },
    body: JSON.stringify(song),
  });
  const data = await response.json();
  dispatch(getSongs(data));
  return data;
};

export const createNewAlbum = (album) => async (dispatch) => {
  const response = await fetch("/api/admin/albums", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(album),
  });
  const data = await response.json();
  dispatch(getAlbums(data));
  return data;
};


export const createNewArtist = (album) => async (dispatch) => {
  const response = await fetch("/api/admin/albums", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(album),
  });
  const data = await response.json();
  dispatch(getAllArtistsThunk(data));
  return data;
};
// reducer function
const initialState = {
  isPlaying: false,
  currentSong: "",
  songs: [],
  albums: [],
  artists: [],
};

const music = (state = initialState, action) => {
  switch (action.type) {
    case PLAY:
      return { ...state, isPlaying: true };
    case PAUSE:
      return { ...state, isPlaying: false };
    case STOP:
      return { ...state, isPlaying: false, currentSong: "" };
    case LOAD_SONG:
      return { ...state, currentSong: action.payload };
    case GET_SONGS:
      return { ...state, songs: action.payload };
    case GET_ALBUMS:
      return { ...state, albums: action.payload };
    case GET_SINGLE_ALBUM:
      return { ...state, currentAlbum: action.payload };
    case GET_ARTISTS:
      return { ...state, artists: action.payload };
    default:
      return state;
  }
};

export default music;