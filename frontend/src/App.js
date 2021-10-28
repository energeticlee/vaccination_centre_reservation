import "./App.css";
import { useState } from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import VaccineRegistration from "./containers/VaccineRegistration/VaccineRegistration";
import VaccineRegistrationListing from "./containers/VaccineRegistration/ListVaccinationBooking";
import EditVaccineRegistration from "./containers/VaccineRegistration/EditVaccinationBooking";
import { NavBar } from "./containers/Nav";
import AdapterDateFns from "@mui/lab/AdapterDayjs";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

const App = () => {
  const [bookingList, setBookingList] = useState([]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <BrowserRouter>
        <NavBar />
        <Switch>
          <Route exact path="/bookings">
            <VaccineRegistrationListing
              bookingList={bookingList}
              setBookingList={setBookingList}
            />
          </Route>
          <Route exact path="/bookings/:bookingId">
            <EditVaccineRegistration
              bookingList={bookingList}
              setBookingList={setBookingList}
            />
          </Route>
          <Route exact path="/">
            <VaccineRegistration setBookingList={setBookingList} />
          </Route>
        </Switch>
      </BrowserRouter>
    </LocalizationProvider>
  );
};

export default App;
