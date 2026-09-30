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
          <Route exact path='/spots/new'><NewSpot /></Route>
          <Route exact path='/spots/current'><ManageSpots /></Route>
          <Route exact path='/spots/:spotId/edit'><UpdateSpot /></Route>
          <Route exact path='/spots/:spotId'><SpotDetails /></Route>
          </Switch>}
      </main>
      <Footer />
    </div>
  );
}

export default App;
