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
const getResults = (R) => {
  return {
    type: "RESUlTS",
    payload: R,
  };
};

export const getSearchResults = () => async (dispatch) => {
  try {
    dispatch(loadState(true));

    // search logic

    let results = [];
    const fetchResults = async () => {
      let response = await fetch(``, {
        method: "GET",
        headers: { "content-type": "application/json" },
      });
    };
  } catch (errors) {
  } finally {
    dispatch(loadState(false));
  }
};

const initialState = {
  query: "",
  loading: false,
  results: [],
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
