const express = require("express");
const router = express.Router();
const bookingTableDB = require("../models/bookingTable");
const userDB = require("../models/user");
const centreDB = require("../models/centre");
const shiftDB = require("../models/shift");
const { getAvailableSlot } = require("../helper");

//* GET available booking date (WORKING)
router.get("/availability/:centreId/:date", (req, res) => {
  const centre = req.params.centreId;
  const dayMonthYear = req.params.date;

  bookingTableDB.findOne({ dayMonthYear, centre }, async (err, table) => {
    if (err) res.status(500).json(err);
    else if (!table) {
      //* NO BOOKING && NO nurseRoster
      centreDB.findById(centre, (err, centreFound) => {
        if (err) res.status(500).json(err);
        else if (!centreFound) res.status(400).json(err);
        else {
          const { minCapacity, operatingHours } = centreFound;
          const fakeData = { maxCapacity: minCapacity };
          const availability = getAvailableSlot(operatingHours, fakeData);
          res.status(200).json({ availability });
        }
      });
    } else if (table) {
      //* CALCULATE MAX CAPACITY
      const popTable = await table.populate("centre");
      //* check if nurseRoster updated
      if (!popTable.nurseRoster) {
        //* Populate centre to get minCap
        table.shift1.maxCapacity = popTable.centre.minCapacity;
        table.shift2.maxCapacity = popTable.centre.minCapacity;
        table.shift3.maxCapacity = popTable.centre.minCapacity;
      }

      const { shift1, shift2, shift3 } = popTable;
      const { operatingHours } = popTable.centre;
      const availability = getAvailableSlot(
        operatingHours,
        shift1,
        shift2,
        shift3
      );

      //* Return data
      res.status(200).json({ availability });
    }
  });
});

//* GET retreive all booking by centreId
router.get("/centre-booking/:centreId", (req, res) => {
  const centreId = req.params.centreId;

  //! that date is greater than Date.now()
  bookingTableDB.find({ centre: centreId }, (err, centreBooking) => {
    if (err) res.status(500).json(err);
    else res.status(200).json(centreBooking);
  });
});

//* GET retreive one booking by userId
router.get("/user-booking/:userId", (req, res) => {
  const userId = req.params.userId;

  //! that date is greater than Date.now()
  userDB.findById(userId, (err, userBooking) => {
    if (err) res.status(500).json(err);
    else res.status(200).json(userBooking);
  });
});

//* POST new booking
router.post("/new", (req, res) => {
  //* Check user exist
  const { nric, centre, dayMonthYear } = req.body;

  userDB.findOne({ nric }, (err, userFound) => {
    if (err) res.status(500).json(err);
    else if (userFound) {
      //* USER EXIST: INVALID
      res.status(400).json({ error: "User Already Exist" });
    } else {
      //* USER NOT FOUND: VALID
      userDB.create(req.body, (err, userCreated) => {
        //* CREATED BUT NO BOOKING REF
        if (err) res.status(500).json(err);
        else {
          //* Which timeslot / shift
          const { timeSlot } = userCreated;
          const getShift = (timeSlot) => {
            if (timeSlot < 13) return "shift1";
            else if (timeSlot > 17) return "shift3";
            else return "shift2";
          };
          const shift = getShift(timeSlot);
          const existPath = `${shift}.timeSlot.${timeSlot}`;
          bookingTableDB.findOneAndUpdate(
            { dayMonthYear, centre },
            { $push: { [existPath]: userCreated._id } },
            { new: true },
            (err, updatedDB) => {
              if (err) res.status(500).json(err);
              else if (!updatedDB) {
                //* NO BOOKING_DB Found => CREATE NEW
                const newPath = `${shift}.timeSlot.${timeSlot}`;
                const dataPackage = {
                  dayMonthYear,
                  centre,
                  [newPath]: [userCreated._id],
                };

                bookingTableDB.create(dataPackage, (err, createdDB) => {
                  if (err) res.status(500).json(err);
                  else {
                    //* SUCCESSFUL CREATED DB, UPDATE USER WITH DB_ID
                    userDB.findByIdAndUpdate(
                      userCreated._id,
                      {
                        $set: { bookingTable: createdDB._id },
                      },
                      { new: true },
                      (err, updatedUserBooking) => {}
                    );
                  }
                });
              } else {
                //* BOOKING_DB FOUND
                if (err) res.status(500).json(err);
                else {
                  res.status(200).json({ updatedDB });
                }
              }
            }
          );
        }
      });
    }
  });
});

//* PUT update user booking
router.put("edit-booking/:userId", (req, res) => {
  const userId = req.params.userId;
  const { booking } = req.body;

  userDB.findByIdAndUpdate(userId, req.body, (err, prevUser) => {
    if (err) res.status(500).json(err);
    else {
      //* User updated centre
      if (booking.centre !== prevUser.centre) {
      }
      //* User updated dayMonthYear
      else if (booking.dayMonthYear !== prevUser.dayMonthYear) {
      }
      //* User updated timeSlot
      else if (booking.timeSlot !== prevUser.timeSlot) {
      }
    }
  });
});

//* Delete user, update booking => pop userId
router.delete("/delete/:userId", (req, res) => {
  const userId = req.params.userId;

  userDB.findByIdAndDelete(userId, (err, deletedUser) => {
    if (err) res.status(500).json(err);
    //* Remove userId from booking
    const { bookingTable, timeSlot } = deletedUser;

    //* Which shift
    const getShift = (timeSlot) => {
      if (timeSlot < 13) return "shift1";
      else if (timeSlot > 17) return "shift3";
      else return "shift2";
    };
    const shift = getShift(timeSlot);
    const popObj = {};
    //* push user_id into schedule
    popObj[shift][timeSlot] = userId;

    bookingTableDB.findByIdAndUpdate(
      bookingTable,
      { $pop: { popObj } },
      { new: true },
      (err, updatedBookingTable) => {
        if (err) res.status(500).json(err);
        else res.status(200).json(updatedBookingTable);
      }
    );
  });
});

module.exports = router;
