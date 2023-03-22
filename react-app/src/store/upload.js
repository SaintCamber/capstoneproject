const initialState = {
  song: {},
  loading: false
};

const uploadSongSuccess = (song) => ({
  type: 'UPLOAD_SONG_SUCCESS',
  payload: song
});



const uploadSongRequest = () => ({
  type: 'UPLOAD_SONG_REQUEST'
});

export const uploadSong = (formData) => async (dispatch) => {
  dispatch(uploadSongRequest());
  try {
    const response = await fetch('api/admin/upload', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });
    if (response.ok) {
      const song = await response.json();
      dispatch(uploadSongSuccess(song));
    }
  } catch (error) {
    return error.message;
  }
};

const upload = (state = initialState, action) => {
  switch (action.type) {
    case 'UPLOAD_SONG':
      return {
        ...state,
        song: action.payload,
        loading: false
      };
    case 'UPLOAD_SONG_REQUEST':
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
};

export default upload;