//action creators

const Search = (query) => {
  return {
    type: "SEARCH",
    payload: query,
  };
};

const loadState = (B) => {
  return {
    type: "LOADING",
    payload: B,
  };
};
const setResults = (R) => {
  return {
    type: "RESULTS",
    payload: R,
  };
};

export const getSearchResults = (query) => async (dispatch) => {
  // alert(query)
  dispatch(Search(query));
  dispatch(loadState(true));
  try {
    // search logic

    let results = [];

    let response = await fetch(`/api/search/${query}`);
    if (!response.ok) {
      return;
    }

    if (response.ok) {
      let data = await response.json();
      dispatch(setResults(data));
      return data;
    }
  } catch (errors) {
  } finally {
    dispatch(loadState(false));
  }
};

const initialState = {
  query: "",
  loading: false,
  results: {},
};

const search = (state = initialState, action) => {
  switch (action.type) {
    case "SEARCH":
      let newState = { ...state };
      return { ...newState, query: action.payload };

    case "LOADING":
      let newState1 = { ...state };

      return { ...newState1, loading: action.payload };

    case "RESULTS":
      let newState2 = { ...state };

      return { ...newState2, results: action.payload };

    default:
      return state;
  }
};

export default search;
