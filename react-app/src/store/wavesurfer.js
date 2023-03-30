import WaveSurfer from 'wavesurfer.js';

// Constants
export const LOAD_WAVESURFER = 'LOAD_WAVESURFER';
export const PLAY = 'PLAY';
export const PAUSE = 'PAUSE';
export const SEEK = 'SEEK';
export const SKIP_FORWARD = 'SKIP_FORWARD';
export const SKIP_BACKWARD = 'SKIP_BACKWARD';
export const STOP = 'STOP';
export const CLEAR_QUEUE = 'CLEAR_QUEUE';
export const APPEND_TO_QUEUE = 'APPEND_TO_QUEUE';
export const PUSH_TO_QUEUE = 'PUSH_TO_QUEUE';
export const SET_CURRENTLY_PLAYING = 'SET_CURRENTLY_PLAYING';
export const SET_IS_PLAYING = 'SET_IS_PLAYING';
export const SET_QUEUE = 'SET_QUEUE';
export const SET_CURRENTLY_PLAYING_INDEX = 'SET_CURRENTLY_PLAYING_INDEX';
export const SET_CURRENTLY_PLAYING_TIME = 'SET_CURRENTLY_PLAYING_TIME';
export const REMOVE_SONG_FROM_QUEUE = 'REMOVE_SONG_FROM_QUEUE';


// Action creators
export const loadWaveSurfer = (audioUrl) => ({
    type: LOAD_WAVESURFER,
    payload: {
        audioUrl,
    },
});

export const play = () => ({
    type: PLAY,
});

export const pause = () => ({
    type: PAUSE,
});

export const seek = (time) => ({
    type: SEEK,
    payload: {
        time,
    },
});




export const skipForward = (time) => ({
    type: SKIP_FORWARD,
    payload: {
        time,
    },
});

export const skipBackward = (time) => ({
    type: SKIP_BACKWARD,
    payload: {
        time,
    },
});

export const stop = () => ({
    type: STOP,
});

export const clearQueue = () => ({
    type: CLEAR_QUEUE,
});

export const appendToQueue = (audioUrls) => ({
    type: APPEND_TO_QUEUE,
    payload: {
        audioUrls,
    },
});

export const pushToQueue = (audioUrls) => ({
    type: PUSH_TO_QUEUE,
    payload: {
        audioUrls,
    },
});
export const removeSongFromQueue = (audioUrl) => ({
    type: REMOVE_SONG_FROM_QUEUE,
    payload: {
        audioUrl,
    },
});


// Thunks
export const loadWaveSurferThunk = (audioUrl) => (dispatch, getState) => {
    const { wavesurfer } = getState().waveform;

    if (wavesurfer) {
        wavesurfer.destroy();
    }

    const newWaveSurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'blue',
        progressColor: 'purple',
    });

    newWaveSurfer.load(audioUrl);

    dispatch(loadWaveSurfer(newWaveSurfer));
};

export const skipForwardThunk = (time) => (dispatch, getState) => {
    const { wavesurfer } = getState().waveform;

    if (wavesurfer) {
        const duration = wavesurfer.getDuration();
        const currentTime = wavesurfer.getCurrentTime();
        let newTime = currentTime + time;

        if (newTime > duration) {
            newTime = duration;
        }

        wavesurfer.seekTo(newTime);
        dispatch(seek(newTime));
    }
};

export const skipBackwardThunk = (time) => (dispatch, getState) => {
    const { wavesurfer } = getState().waveform;

    if (wavesurfer) {
        const currentTime = wavesurfer.getCurrentTime();
        let newTime = currentTime - time;

        if (newTime < 0) {
            newTime = 0;
        }

        wavesurfer.seekTo(newTime);
        dispatch(seek(newTime));
    }
};

export const stopThunk = () => (dispatch, getState) => {
    const { wavesurfer } = getState().waveform;

    if (wavesurfer) {
        wavesurfer.stop();
        dispatch(pause());
        dispatch(seek(0));
    }
};

export const clearQueueThunk = () => (dispatch) => {
    dispatch(clearQueue());
};

export const appendToQueueThunk = (audioUrls) => (dispatch
) => {
    dispatch(appendToQueue(audioUrls));
}

export const removeFromQueueThunk = (audioUrl) => (dispatch, getState) => {
    const { queue } = getState().waveform;
    const newQueue = queue.filter((url) => url !== audioUrl);

    dispatch(pushToQueue(newQueue));
};

export const pushToQueueThunk = (audioUrls) => (dispatch) => {
    dispatch(pushToQueue(audioUrls));
}
export const playThunk = () => (dispatch, getState) => {
    const { wavesurfer } = getState().waveform;

    if (wavesurfer) {
        wavesurfer.play();
        dispatch(play());
    }
};

export const pauseThunk = () => (dispatch, getState) => {
    const { wavesurfer } = getState().waveform;

    if (wavesurfer) {
        wavesurfer.pause();
        dispatch(pause());
    }
};

export const seekThunk = (time) => (dispatch, getState) => {
    const { wavesurfer } = getState().waveform;

    if (wavesurfer) {
        wavesurfer.seekTo(time);
        dispatch(seek(time));
    }
};



// Reducer
const initialState = {
    wavesurfer: null,
    queue: [],

};


export default function waveform(state = initialState, action) {
    switch (action.type) {
        case LOAD_WAVESURFER:
            return {
                ...state,
                wavesurfer: action.payload.audioUrl,
            };
        case PLAY:
            return {
                ...state,
                wavesurfer: {
                    ...state.wavesurfer,
                    isPlaying: true,
                },
            };
        case PAUSE:
            return {
                ...state,
                wavesurfer: {
                    ...state.wavesurfer,
                    isPlaying: false,
                },
            };
        case SEEK:
            return {
                ...state,
                wavesurfer: {
                    ...state.wavesurfer,
                    currentTime: action.payload.time,
                },
            };
        case SKIP_FORWARD:
            return {
                ...state,
                wavesurfer: {
                    ...state.wavesurfer,
                    currentTime: state.wavesurfer.currentTime + action.payload.time,
                },
            };
        case SKIP_BACKWARD:
            return {
                ...state,

                wavesurfer: {
                    ...state.wavesurfer,
                    currentTime: state.wavesurfer.currentTime - action.payload.time,
                },
            };


        case STOP:
            return {
                ...state,
                wavesurfer: {
                    ...state.wavesurfer,
                    isPlaying: false,
                    currentTime: 0,
                },
            };
        case CLEAR_QUEUE:
            return {
                ...state,
                queue: [],
            };

        case APPEND_TO_QUEUE:
            return {
                ...state,

                queue: [...state.queue, ...action.payload.audioUrls],
            };

        case PUSH_TO_QUEUE:
            return {
                ...state,
                queue: [...action.payload.audioUrls, ...state.queue],
            };


        default:
            return state;
    }
}


