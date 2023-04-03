import { initWaveSurfer, playWaveSurfer, pauseWaveSurfer, stopWaveSurfer } from '../components/playbar/wavesurferUtils'




const PLAY = "music/play";
const PAUSE = "music/pause";
const STOP = "music/stop";
const LOAD_SONG = "music/loadSong";
const PLAY_ALBUM = "music/playAlbum";
const GET_SONGS = "music/getSongs";
const GET_ALBUMS = "music/getAlbums";
const GET_ARTISTS = "music/getArtists";
const GET_SINGLE_ALBUM = "music/getSingleAlbum";
const DELETE_SONG = "music/deleteSong";
const DELETE_ALBUM = "music/deleteAlbum";
const DELETE_ARTIST = "music/deleteArtist";
const UPDATE_ALBUM = "music/updateAlbum";
const UPDATE_ARTIST = "music/updateArtist";
const UPDATE_SONG = "music/updateSong";
const CLEAR_QUEUE = "music/clearQueue";
const PLAY_TRACK = "music/playTrack";
const ARTIST_ALBUMS = "music/artistAlbums";
const ADD_SONG_TO_QUEUE_NEXT = "music/addSongToQueueNext";
const ADD_SONG_TO_QUEUE_LAST = "music/addSongToQueueLast";
const REMOVE_SONG_FROM_QUEUE = "music/removeSongFromQueue";
const UPLOAD_SONG = "music/uploadSong";

export const playSong = (song) => ({
  type: PLAY_TRACK,
  payload: song
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
export const newSong = (formData) => ({
  type: UPLOAD_SONG,
  payload: formData,
});
export const playAlbum = (album) => ({
  type: PLAY_ALBUM,
  payload: album,
});

export const getArtistsAlbums = (artistId) => ({
  type: ARTIST_ALBUMS,
  payload: artistId,
});
export const addSongToQueueNext = (song) => ({
  type: ADD_SONG_TO_QUEUE_NEXT,
  payload: song,
});
export const addSongToQueueLast = (song) => ({
  type: ADD_SONG_TO_QUEUE_LAST,
  payload: song,
});
export const removeSongFromQueue = (index) => ({
  type: REMOVE_SONG_FROM_QUEUE,
  payload: index,
});

export const clearQueue = () => ({
  type: CLEAR_QUEUE,
});

export const getAllSongs = (songs) => ({
  type: GET_SONGS,
  payload: songs,
});


export const uploadSong = (formData) => async (dispatch) => {
  const res =await fetch("api/admin/upload", {
    method: "POST",
    body: formData,
    headers: {
      enctype: "multipart/form-data",
    },
  });
  if (res.ok){
  const data = await res.json();
  
  dispatch(newSong(data));}
  return {};
};
export const addSongToQueueNextThunk = (song) => (dispatch) => {
  dispatch(addSongToQueueNext(song));
};

export const addSongToQueueLastThunk = (song) => (dispatch) => {
  dispatch(addSongToQueueLast(song));

};

export const removeSongFromQueueThunk = (index) => (dispatch) => {
  dispatch(removeSongFromQueue(index));
};

export const clearQueueThunk = () => (dispatch) => {
  dispatch(clearQueue());
};



export const deleteSong = (songId, albumId, artistId) => {
  return {
    type: DELETE_SONG,
    payload: { songId, albumId, artistId },
  };
};

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

export const getArtistsAlbumsThunk = (artistId) => async (dispatch) => {
  const response = await fetch(`/api/admin/artists/${artistId}/albums`);
  const data = await response.json();
  dispatch(getArtistsAlbums(data));
};

export const getArtists = (artists) => ({
  type: GET_ARTISTS,
  payload: artists
})

export const playAlbumThunk = (album) => async (dispatch) => {
  const response = await fetch(`/api/admin/albums/${album.id}`)
  const data = await response.json()
  dispatch(playAlbum(data.songs))
  dispatch(playSong())
}
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

export const getSingleAlbumThunk = (albumId) => async (dispatch) => {
  const response = await fetch(`/api/admin/albums/${albumId}`);
  const data = await response.json();
  console.log(data, "response from getSingleAlbum thunk")
  dispatch(getSingleAlbum(data));
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



export const deleteASong = (songId, albumId, artistId) => async (dispatch) => {
  const response = await fetch(`/api/admin/songs/${songId}`, {
    method: "DELETE",
  });
  const data = await response.json();
  dispatch(deleteSong(songId, albumId, artistId));
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
  const response = await fetch(`/api/admin/delete_artist/${artistId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ artistId })
  });
  const data = await response.json();
  if (response.ok) {
    dispatch(deleteArtist(artistId));
  }
  return data;
}

export const playSongThunk = (song) => async (dispatch) => {
  dispatch(playSong(song))
}


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

//paginated versions of the above
export const getSongsPages = (page) => async (dispatch) => {
  const response = await fetch(`/api/admin/songs/pages/all?page=${page}`);
  const data = await response.json();
  console.log(data, "response from getSongs thunk")
  dispatch(getAllSongs(data.items));
  return data;
};

export const getAlbumsPages = (page) => async (dispatch) => {
  const response = await fetch(`/api/admin/albums/pages/all?page=${page}`);
  const data = await response.json();
  console.log(data, "response from getAlbums thunk")
  dispatch(getAllAlbums(data.items));
  return data;
};

export const getAllArtistsPages = (page) => async (dispatch) => {
  const response = await fetch(`/api/admin/artists/pages/all?page=${page}`);
  const data = await response.json();
  dispatch(getArtists(data.items));
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


export const createNewArtist = (artist) => async (dispatch) => {
  const response = await fetch("/api/admin/artists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(artist),
  });
  const data = await response.json();
  dispatch(getAllArtistsThunk(data));
  return data;
};
// reducer function
const initialState = {
  isPlaying: false,
  songUrl: null,
  currentlyPlaying: null,
  songs: [],
  albums: [],
  artists: [],
  currentAlbum: null,
  currentTrackIndex: null,
  queue: [],
};

const music = (state = initialState, action) => {
  switch (action.type) {
    case PLAY_TRACK: {
      console.log("playTrack called")
      console.log(action.payload, "payload for playTrack")

      return {
        ...state,
        currentlyPlaying: action.payload,
        songUrl: action.payload.fileUrl
      };
    }
    case 'PAUSE_TRACK': {
      const { wavesurfer } = state;
      pauseWaveSurfer(wavesurfer);

      return {
        ...state,
      };
    }
    case 'STOP_TRACK': {
      const { wavesurfer } = state;
      stopWaveSurfer(wavesurfer);

      return {
        ...state,
        currentlyPlaying: null,
        songUrl: null
      };
    }
    case 'RESUME_TRACK': {
      const { wavesurfer } = state;
      playWaveSurfer(wavesurfer);

      return {
        ...state,
      };
    }

    case PLAY:
      return { ...state, isPlaying: true };
    case PAUSE:
      return { ...state, isPlaying: false };
    case STOP:
      return { ...state, isPlaying: false, songUrl: null };
    case LOAD_SONG:
      return { ...state, songUrl: action.payload };
    case GET_SONGS:
      return { ...state, songs: action.payload };
    case GET_ALBUMS:
      return { ...state, albums: action.payload };
    case GET_ARTISTS:
      return { ...state, artists: action.payload };
    case GET_SINGLE_ALBUM:
      return { ...state, currentAlbum: action.payload };
    case DELETE_SONG:
      const updatedAlbum = state.albums.map((album) => {
        if (album.id === action.payload.albumId) {
          return {
            ...album,
            songs: album.songs.filter((song) => song.id !== action.payload.songId),
          };
        } else {
          return album;
        }
      });

      const updatedArtist = state.artists.map((artist) => {
        if (artist.id === action.payload.artistId) {
          return {
            ...artist,
            albums: artist.albums.map((album) => {
              if (album.id === action.payload.albumId) {
                return {
                  ...album,
                  songs: album.songs.filter((song) => song.id !== action.payload.songId),
                };
              } else {
                return album;
              }
            }),
          };
        } else {
          return artist;
        }
      });

      return {
        ...state,
        songs: state.songs.filter((song) => song.id !== action.payload.songId),
        albums: updatedAlbum,
        artists: updatedArtist,
      };
    case DELETE_ALBUM:
      const albumId = action.payload;
      const updatedAlbums = state.albums.filter(album => album.id !== albumId);
      const updatedArtists = state.artists
        .map(artist => {
          const artistAlbums = artist.albums.filter(album => album.id !== albumId);
          if (artistAlbums.length === 0) {
            return null; // Return null if artist has no albums
          }
          return { ...artist, albums: artistAlbums };
        })
        .filter(artist => artist !== null); // Filter out null artists

      return {
        ...state,
        albums: updatedAlbums,
        artists: updatedArtists,
      };

    case UPDATE_ALBUM:
      return {
        ...state,
        albums: state.albums.map(album => {
          if (album.id === action.payload.id) {
            return {
              ...album,
              title: action.payload.title,
              artistId: action.payload.artistId,
            };
          } else {
            return album;
          }
        }),
      };
    case UPDATE_ARTIST:
      return {
        ...state,
        artists: state.artists.map(artist => {
          if (artist.id === action.payload.id) {
            return {
              ...artist,
              name: action.payload.name,
            };
          } else {
            return artist;
          }
        }),
      };

    case 'DELETE_ARTIST': {
      const artistId = +action.payload;
      const updatedArtists = state.artists.filter(artist => artist.id !== artistId);
      const updatedAlbums = state.albums.filter(album => album.artist_id !== artistId);
      const updatedSongs = state.songs.filter(song => song.artist_id !== artistId);

      return {
        ...state,
        artists: updatedArtists,
        albums: updatedAlbums,
        songs: updatedSongs,
      };



     
      
    }
      
     

    case ADD_SONG_TO_QUEUE_NEXT:
      return {
        ...state,
        queue: [action.payload, ...state.queue],
      };
    case ADD_SONG_TO_QUEUE_LAST:
      return {
        ...state,
        queue: [...state.queue, action.payload],
      };
    case REMOVE_SONG_FROM_QUEUE:
      return {
        ...state,
        queue: state.queue.filter(song => song.id !== action.payload),
      };
    case CLEAR_QUEUE:
      return {
        ...state,
        queue: [],
      };
    case UPDATE_SONG:
      return {
        ...state,
        songs: state.songs.map(song => {
          if (song.id === action.payload.id) {
            return {
              ...song,
              title: action.payload.title,
              albumId: action.payload.albumId,
            };
          } else {
            return song;
          }
        }),
      };
    case PLAY_ALBUM:
      const currentlyPlaying = [];
      action.payload.forEach(song => {
        currentlyPlaying.push({
          id: song.id,
          title: song.title,
          artist: song.artist,
          album: song.album,
          duration: song.duration,
          audioUrl: song.audioUrl,
        });
      });
      return {
        ...state,
        currentAlbum: action.payload,
        currentlyPlaying: currentlyPlaying,
        isPlaying: true,
      };

      case ARTIST_ALBUMS:
      return {
        ...state,
        artistAlbums: action.payload,
      };
      case UPLOAD_SONG:
      return {
        ...state,
        songs: [...state.songs, action.payload.song],
        albums: [...state.albums, action.payload.album],
        artists: [...state.artists, action.payload.artist],
      };
    default:
      return state;
  }
};

export default music;