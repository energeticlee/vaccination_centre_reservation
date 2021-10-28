import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  useUserInfo,
  useFetchAvailability,
} from "../Helper/customeHooks";

const EditVaccinationBooking = ({}) => {
  const [centreList, setCentreList] = useState([]);
  const [selectedCentre, setSelectedCentre] = useState("");
  const [selectedDate, setSelectedDate] = useState();
  const [selectedSlot, setSelectedSlot] = useState("");
  const [availability, setAvailability] = useState();
  const [userInfo, setUserInfo] = useState({});
  const [message, setMessage] = useState("");

  const { bookingId } = useParams();

  useFetchCentre({ setCentreList, setMessage });
  useUserInfo({ bookingId, setUserInfo, setMessage });
  useFetchAvailability(
    {
      selectedDate,
      selectedCentre,
      setAvailability,
      setMessage,
    },
    setUserInfo
  );

  const handleSubmitBooking = async () => {
    const d = new Date(selectedDate);
    const date = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;

    const userPackage = {
      ...userInfo,
      dayMonthYear: date,
      timeSlot: selectedSlot,
      centreName: selectedCentre.name,
      centre: selectedCentre._id,
    };

    //* UPDATE
    // submitRegistration({ userPackage, setBookingList, setMessage, history });
  };

  return (
    <>
      <CssBaseline />
      <Container>
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
            label={userInfo.nric}
            name="NRIC"
            autoComplete="nric"
            value={userInfo.nric}
            onChange={(e) =>
              setUserInfo((data) => ({ ...data, nric: e.target.value }))
            }
            sx={{ mb: 2 }}
            autoFocus
          />
          <TextField
            required
            fullWidth
            id="name"
            label={userInfo?.username}
            sx={{ mb: 2 }}
            name="name"
            autoComplete="name"
            onChange={(e) =>
              setUserInfo((data) => ({ ...data, username: e.target.value }))
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
                onChange={(e) => {
                  console.log(e.target);
                  setSelectedSlot(e.target.value);
                }}
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
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmitBooking}
          >
            Register!
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default EditVaccinationBooking;
