import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import UploadForm from "./components/upload";
import LandingPage from "./components/LandingPage";
import SideBar from "./components/SideBar";
import CreatePlaylist from "./components/playlists/CreatePlaylist.js";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import Playbar from "./components/playbar";
import AlbumPage from "./components/AlbumPage";
import PlaylistPage from "./components/playlists/PlaylistPage";
import { getAllPlaylists } from "./store/playlists";
import "./index.css";
import AdminPanel from "./components/adminPages/AdminPanel";
import AddSongs from "./components/playlists/Addsongs";
import SearchBar from "./components/SearchBar";
import ArtistPage from "./components/ArtistPage";
import clearSearch from "./store/search.js";
function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const user = useSelector((state) => state.session.user);
  const playlists = useSelector((state) => state.playlists.user_playlists);
  useEffect(() => {
    dispatch(authenticate())
      .then(() => setIsLoaded(true))
      .then(() => {
        if (user) {
          dispatch(getAllPlaylists(user?.id));
        }
      })
      .then(window.scrollTo(0, 0));
  }, [dispatch]);
  console.log(playlists, "playlists in the app.js");

  return (
    <div className="App">
      <Navigation isLoaded={isLoaded} />
      <SideBar />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route path="/login">
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <Route path="/AdminPanel">
            {user?.email === "demo@aa.io" ? (
              <AdminPanel />
            ) : (
              <h1>Only the demo user can access admin function</h1>
            )}
          </Route>
          <Route path="/newPlaylist">
            <CreatePlaylist />
          </Route>
          <Route path="/add/:PlaylistId">
            <AddSongs />
          </Route>
          <Route path="/playlists/:PlaylistId">
            {!user ? <LoginFormPage/>:<PlaylistPage />}
          </Route>
          <Route path="/albums/:albumId">
            <AlbumPage />
          </Route>
          <Route path="/search">
            <SearchBar />
          </Route>
          <Route path="/artists/:artistId">
            <ArtistPage />
          </Route>
        </Switch>
      )}
      <Playbar />
    </div>
  );
}
//
export default App;
