import React, { useState, useEffect } from "react";
import { getSearchResults } from "../../store/search";
import { useDispatch, useSelector } from "react-redux";

function SearchBar() {
  const dispatch = useDispatch();
  const { query, loading, results } = useSelector((state) => state.search);
  const [newQuery, setNewQuery] = useState("");
  const handleChange = (event) => {
    const { value } = event.target;
    setNewQuery(value);
    dispatch();
    dispatch(getSearchResults(value));
  };

  useEffect(() => {}, []);

  return (
    <section role="search">
      <form action="#" method="get">
        <fieldset>
          <label htmlFor="s">
            <input
              type="search"
              name="s"
              id="s"
              placeholder="Search..."
              maxLength="200"
              value={query}
              onChange={handleChange}
            />
            <button type="submit">Search</button>
          </label>
        </fieldset>
      </form>

      {loading && <p>Loading...</p>}

      {results.length > 0 && (
        <div>
          <h2>Search Results:</h2>
          <ul>
            {results.map((result) => (
              <li key={result.id}>{result.name}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default SearchBar;
