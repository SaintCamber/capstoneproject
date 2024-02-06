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
      return { ...state, query: action.payload };

    case "LOADING":
      return { ...state, loading: action.payload };

    case "RESULTS":
      return { ...state, results: action.payload };

    default:
      return state;
  }
};

export default search;
