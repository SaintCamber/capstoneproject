import React, { useState, useEffect } from "react";
import { getSearchResults, clearSearch } from "../../store/search";
import { useDispatch, useSelector } from "react-redux";
import AlbumCard from "../AlbumCard";
import SongRow from "../SongRowCopy";
import ArtistCard from "../ArtistCard";
import "./index.css";

function SearchBar() {
  const dispatch = useDispatch();
  const { query, loading, results } = useSelector((state) => state.search);
  const [newQuery, setNewQuery] = useState("");
  const handleChange = (event) => {
    const { value } = event.target;
    setNewQuery(value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    return dispatch(getSearchResults(newQuery.toLowerCase()));
  };
  useEffect(() => () => clearSearch, []);

  return (
    <section role="search" className="SearchSection">
      <form
        className="SearchForm"
        action="#"
        method="get"
        onSubmit={handleSubmit}
      >
        <fieldset className="SearchFieldset">
          <label htmlFor="s">
            <input
              type="search"
              name="s"
              id="s"
              placeholder="Search..."
              maxLength="200"
              value={newQuery}
              onChange={handleChange}
            />
            <button className="SearchButton" type="submit">
              Search
            </button>
          </label>
        </fieldset>
      </form>

      {loading && <p>Loading...</p>}

      {(results?.artists?.length ||
        results?.albums?.length ||
        results?.songs?.length) && (
        <div className="SearchResults">
          <h2>Search Results:</h2>
          <h4>Songs</h4>
          {results?.songs?.map((song, i = 1) => {
            return <SongRow key={i} song={song} trackNumber={++i} />;
          })}

          <h4>Albums</h4>
          {results?.albums?.map((album) => (
            <AlbumCard key={album?.id} album={album} />
          ))}

          <h4>Artists</h4>

          {results?.artists?.map((artist) => (
            <ArtistCard artist={artist} key={artist.id} />
          ))}
        </div>
      )}
    </section>
  );
}

export default SearchBar;
