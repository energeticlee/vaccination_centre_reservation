import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  Container,
  Box,
  Button,
  Typography,
  CssBaseline,
  TextField,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import DatePicker from "@mui/lab/DatePicker";
import {
  useFetchCentre,
  useFetchAvailability,
  submitRegistration,
} from "../Helper/customeHooks";

const VaccineRegistration = ({ setBookingList }) => {
  const [centreList, setCentreList] = useState([]);
  const [selectedCentre, setSelectedCentre] = useState("");
  const [selectedDate, setSelectedDate] = useState();
  const [selectedSlot, setSelectedSlot] = useState("");
  const [availability, setAvailability] = useState();
  const [message, setMessage] = useState("");
  const [bookingData, setBookingData] = useState("");
  const history = useHistory();

  useFetchAvailability(
    {
      selectedDate,
      selectedCentre,
      setAvailability,
      setMessage,
    },
    setBookingData
  );

  useFetchCentre({ setCentreList, setMessage });

  const handleSubmitBooking = async () => {
    const d = new Date(selectedDate);
    const date = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
    const userPackage = {
      ...bookingData,
      dayMonthYear: date,
      timeSlot: selectedSlot,
      centreName: selectedCentre.name,
      centre: selectedCentre._id,
    };
    submitRegistration({ userPackage, setBookingList, setMessage, history });
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container>
        {message && <h1>{message}</h1>}
        <Box
          component="form"
          sx={{
            mt: 8,
          }}
        >
          <Typography component="h1" variant="h5">
            Book a slot
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="nric"
            label="NRIC Number"
            name="NRIC"
            autoComplete="nric"
            sx={{ mb: 2 }}
            autoFocus
            onChange={(e) =>
              setBookingData((data) => ({ ...data, nric: e.target.value }))
            }
          />
          <TextField
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            sx={{ mb: 2 }}
            onChange={(e) =>
              setBookingData((data) => ({ ...data, username: e.target.value }))
            }
          />
          <InputLabel id="vaccineCenterLabel">Vaccine Center</InputLabel>
          <Select
            labelId="vaccineCenterLabel"
            label="Vaccine Center"
            required
            fullWidth
            id="vaccineCenter"
            value={selectedCentre}
            onChange={(e) => {
              setSelectedCentre(e.target.value);
            }}
            sx={{ mb: 2 }}
          >
            {centreList &&
              centreList.map((centre) => {
                return (
                  <MenuItem key={centre._id} value={centre}>
                    {centre.name}
                  </MenuItem>
                );
              })}
          </Select>
          <DatePicker
            renderInput={(props) => <TextField {...props} />}
            label="Select Date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e);
            }}
            required
          />
          {availability && (
            <>
              <InputLabel id="vaccineCenterLabel">Available Slot</InputLabel>
              <Select
                labelId="AvailableSlotLabel"
                label="Available Slot"
                required
                fullWidth
                id="availableSlot"
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                sx={{ mb: 2 }}
              >
                {Object.entries(availability).map(([key, value]) => (
                  <MenuItem key={key} value={key}>
                    {`${key}: ${value} Slots Available`}
                  </MenuItem>
                ))}
              </Select>
            </>
          )}
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmitBooking}
          >
            Register!
          </Button>
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default VaccineRegistration;
