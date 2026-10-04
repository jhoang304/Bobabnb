import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotsIndex from "./components/SpotsIndex";
import SpotDetails from "./components/SpotDetails";
import NewSpot from "./components/NewSpot";
import ManageSpots from "./components/ManageSpots";
import UpdateSpot from "./components/UpdateSpot";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <div className="App">
      <Navigation isLoaded={isLoaded} />
      <main className="App-main">
        {isLoaded && <Switch>
          <Route exact path='/'><SpotsIndex /></Route>
          <ProtectedRoute exact path='/spots/new'><NewSpot /></ProtectedRoute>
          <ProtectedRoute exact path='/spots/current'><ManageSpots /></ProtectedRoute>
          {/* Spot ids are numbers, so /spots/abc falls through to the 404 page */}
          <ProtectedRoute exact path='/spots/:spotId(\d+)/edit'><UpdateSpot /></ProtectedRoute>
          <Route exact path='/spots/:spotId(\d+)'><SpotDetails /></Route>
          <Route><NotFound /></Route>
          </Switch>}
      </main>
      <Footer />
    </div>
  );
}

export default App;
