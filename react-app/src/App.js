import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import UploadForm from "./components/upload"
import LandingPage from "./components/LandingPage"
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import Playbar from "./components/playbar";
import PlaylistPage from "./components/playlists/PlaylistsPage";
import { getAllPlaylists } from "./store/playlists";
import './index.css'

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const user = useSelector(state => state.session.user);
  const playlists = useSelector(state => state.playlists.user_playlists)
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true)).then( dispatch(getAllPlaylists(user?.id)))
  }, [dispatch]);
  console.log(playlists, 'playlists in the app.js')

  return (
    <div className='App'>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path='/'>
            <LandingPage />
          </Route>
          <Route path="/login" >
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <Route path='/upload'>
            {user?.email === 'demo@aa.io' ? <UploadForm /> : <h1>Only the demo user can upload</h1>}
          </Route>
         
          <Route path='/user/playlists/:id'>
            <PlaylistPage playlists={playlists} />
          </Route>
        </Switch>
      )}
      <Playbar />

    </div>
  );
}

export default App;
