import Cookies from 'js-cookie';

export const uploadSong = (title, artist, album, genre, file) => async dispatch => {
  const csrfToken = Cookies.get('csrf_token');
  const formData = new FormData();
  formData.append('title', title);
  formData.append('artist', artist);
  formData.append('album', album);
  formData.append('genre', genre);
  formData.append('file', file);
  formData.append('csrfToken',csrfToken);

  try {
    const response = await fetch('api/admin/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Unable to upload song');
    }

    const data = await response.json();
    dispatch({ type: 'UPLOAD_SONG_SUCCESS', payload: data.song });
  } catch (error) {
    dispatch({ type: 'UPLOAD_SONG_FAILURE', payload: error.message });
  }
};



const initialState = {
    song: null,
    error: null,
    loading: false
  };
  
  const uploadReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'UPLOAD_SONG_SUCCESS':
        return {
          ...state,
          song: action.payload,
          error: null,
          loading: false
        };
      case 'UPLOAD_SONG_FAILURE':
        return {
          ...state,
          error: action.payload,
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
  
  export default uploadReducer;
  