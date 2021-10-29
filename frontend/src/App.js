import "./App.css";
import { useState } from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import VaccineRegistration from "./containers/VaccineRegistration/VaccineRegistration";
import VaccineRegistrationListing from "./containers/VaccineRegistration/ListVaccinationBooking";
import EditVaccineRegistration from "./containers/VaccineRegistration/EditVaccinationBooking";
import { NavBar } from "./containers/Nav";
import AdapterDateFns from "@mui/lab/AdapterDayjs";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { useFetchCentre } from "./containers/Helper/customeHooks";

const App = () => {
  const [bookingList, setBookingList] = useState([]);
  const [centreList, setCentreList] = useState([]);

  useFetchCentre({ setCentreList });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <BrowserRouter>
        <NavBar />
        <Switch>
          <Route exact path="/bookings">
            <VaccineRegistrationListing
              bookingList={bookingList}
              setBookingList={setBookingList}
              centreList={centreList}
            />
          </Route>
          <Route exact path="/bookings/:bookingId">
            <EditVaccineRegistration setBookingList={setBookingList} />
          </Route>
          <Route exact path="/">
            <VaccineRegistration
              setBookingList={setBookingList}
              centreList={centreList}
            />
          </Route>
        </Switch>
      </BrowserRouter>
    </LocalizationProvider>
  );
};

export default App;
