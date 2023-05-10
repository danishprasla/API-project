import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LandingPageIndex from "./components/LandingPage";
import SpotPageIndex from "./components/SpotPage"
import CreateSpotFormIndex from "./components/CreateSpotForm";
import CurrentSpotsIndex from "./components/CurrentSpots";
import EditReportIndex from "./components/EditSpot";
import DeleteSpotModalIndex from "./components/DeleteSpotModal";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded &&
        <Switch>
          <Route exact path="/" component={LandingPageIndex} />
          <Route path="/spots/new" component={CreateSpotFormIndex} />
          <Route path="/spots/current" component={CurrentSpotsIndex} />
          <Route exact path="/spots/:spotId/edit" component={EditReportIndex} />
          <Route path="/spots/:spotId" component={SpotPageIndex} />
        </Switch>
      }
    </>
  );
}

export default App;