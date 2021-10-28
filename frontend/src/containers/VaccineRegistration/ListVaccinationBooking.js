import React from "react";
import {
  Table,
  Box,
  Button,
  CssBaseline,
  Typography,
  TableContainer,
  TableCell,
  TableBody,
  TableRow,
  TableHead,
  Container,
} from "@mui/material";
import { Link } from "react-router-dom";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getTime } from "../Helper/function";

const ListVaccinationBooking = ({ bookingList, setBookingList }) => {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container>
        <Box sx={{ mt: 8 }}>
          <Box sx={{ mt: 8, display: "flex", justifyContent: "space-between" }}>
            <Typography component="h1" variant="h5">
              Active Booking
            </Typography>
            <Typography component="h1" variant="h5">
              Select Centre
            </Typography>
          </Box>
          <TableContainer component={Box}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="left">Center Name</TableCell>
                  <TableCell align="left">Start Time</TableCell>
                  <TableCell align="left">&nbsp;</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* EDIT THIS */}
                {bookingList &&
                  bookingList.map((row) => (
                    <TableRow
                      key={row._id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.username}
                      </TableCell>
                      <TableCell align="left">{row.centreName}</TableCell>
                      <TableCell align="left">
                        {getTime(row.dayMonthYear, row.timeSlot)}
                      </TableCell>
                      <TableCell align="left">
                        <Button component={Link} to={`/bookings/${row._id}`}>
                          <ModeEditIcon />
                        </Button>
                        <Button>
                          <DeleteIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default ListVaccinationBooking;
