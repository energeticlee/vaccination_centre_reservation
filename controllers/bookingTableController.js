const express = require("express");
const router = express.Router();
const bookingTableDB = require("../models/bookingTable");
const userDB = require("../models/user");
const centreDB = require("../models/centre");
const {
  getAvailableSlot,
  getShift,
  getDate,
  getShiftBooking,
} = require("../helper");

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
  bookingTableDB.find({ centre: centreId }, async (err, centreBooking) => {
    //* SORT BY DAY
    centreBooking.sort((a, b) => {
      return getDate(a.dayMonthYear) - getDate(b.dayMonthYear);
    });

    //! Return [userData => shift1 > 2 > 3]
    const bookingIdArr = getShiftBooking(centreBooking);

    const recursiveFind = async (bookingIdArr, count = 0, arr = []) => {
      if (count >= bookingIdArr.length) return arr;

      const id = bookingIdArr[count].toString();
      const findByPromise = new Promise((resolve, reject) => {
        userDB.findById(id).then((data) => resolve(data));
      });

      await findByPromise.then((data) => arr.push(data));
      return await recursiveFind(bookingIdArr, (count += 1), arr);
    };
    const popResult = await recursiveFind(bookingIdArr);

    if (err) res.status(500).json(err);
    else res.status(200).json({ allCentreBooking: popResult });
  });
});

//* GET retreive one booking by userId (WORKING)
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
                      (err, updatedUserBooking) => {
                        console.log("updatedUserBooking", updatedUserBooking);
                        if (err) res.status(400).json(err);
                        else
                          res
                            .status(200)
                            .json({ userBooking: updatedUserBooking });
                      }
                    );
                  }
                });
              } else {
                //* BOOKING_DB FOUND AND UPDATED
                if (err) res.status(500).json(err);
                else {
                  //* UPDATE USER WITH DB_ID
                  userDB.findByIdAndUpdate(
                    userCreated._id,
                    {
                      $set: { bookingTable: updatedDB._id },
                    },
                    { new: true },
                    (err, updatedUserBooking) => {
                      if (err) res.status(400).json(err);
                      else
                        res
                          .status(200)
                          .json({ userBooking: updatedUserBooking });
                    }
                  );
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
router.put("/edit-booking/:userId", (req, res) => {
  const userId = req.params.userId;
  console.log(req.body);
  const { centre, dayMonthYear, timeSlot } = req.body;

  userDB.findByIdAndUpdate(userId, req.body, async (err, prevUser) => {
    if (err) res.status(500).json(err);
    else {
      //* centre Change, remove id from bookingDB..timslot
      if (
        centre !== prevUser.centre ||
        dayMonthYear !== prevUser.dayMonthYear ||
        timeSlot !== prevUser.timeSlot
      ) {
        //* in PrevBookingDB, update pop user._id
        const popPreBook = await prevUser.populate("bookingTable");
        const oldShift = getShift(popPreBook.timeSlot);
        const prevTimeSlot = popPreBook.timeSlot;

        const targetSlot =
          popPreBook.bookingTable[oldShift].timeSlot[prevTimeSlot];

        targetSlot.splice(targetSlot.indexOf(prevUser._id), 1);
        popPreBook.bookingTable[oldShift].timeSlot[prevTimeSlot] = targetSlot;

        bookingTableDB.findByIdAndUpdate(targetSlot._id, popPreBook);

        //* add new bookingDB and add timeSlot
        //* Which timeslot / shift
        const { timeSlot } = req.body;

        const shift = getShift(timeSlot);
        const existPath = `${shift}.timeSlot.${timeSlot}`;
        bookingTableDB.findOneAndUpdate(
          { dayMonthYear, centre },
          { $push: { [existPath]: req.body._id } },
          { new: true },
          (err, updatedDB) => {
            if (err) res.status(500).json(err);
            else if (!updatedDB) {
              //* NO BOOKING_DB Found => CREATE NEW
              const newPath = `${shift}.timeSlot.${timeSlot}`;
              const dataPackage = {
                dayMonthYear,
                centre,
                [newPath]: [req.body._id],
              };

              bookingTableDB.create(dataPackage, (err, createdDB) => {
                if (err) res.status(500).json(err);
                else {
                  //* SUCCESSFUL CREATED DB, UPDATE USER WITH DB_ID
                  userDB.findByIdAndUpdate(
                    req.body._id,
                    {
                      $set: { bookingTable: createdDB._id },
                    },
                    { new: true },
                    (err, updatedUserBooking) => {
                      if (err) res.status(400).json(err);
                      else
                        res
                          .status(200)
                          .json({ userBooking: updatedUserBooking });
                    }
                  );
                }
              });
            } else {
              //* BOOKING_DB FOUND AND UPDATED
              if (err) res.status(500).json(err);
              else {
                //* UPDATE USER WITH DB_ID
                userDB.findByIdAndUpdate(
                  req.body._id,
                  {
                    $set: { bookingTable: updatedDB._id },
                  },
                  { new: true },
                  (err, updatedUserBooking) => {
                    if (err) res.status(400).json(err);
                    else
                      res.status(200).json({ userBooking: updatedUserBooking });
                  }
                );
              }
            }
          }
        );
      }
    }
  });
});

//* Delete user, update booking => pop userId
router.delete("/:userId", (req, res) => {
  const userId = req.params.userId;

  userDB.findByIdAndDelete(userId, async (err, deletedUser) => {
    if (err) res.status(500).json(err);
    //* Remove userId from booking
    const { bookingTable, timeSlot } = deletedUser;
    console.log("deletedUser", deletedUser);
    const popUserBooking = await deletedUser.populate("bookingTable");
    const bookingDb = popUserBooking.bookingTable;
    const shift = getShift(timeSlot);
    bookingDb[shift].timeSlot[timeSlot].splice(
      bookingDb[shift].timeSlot[timeSlot].indexOf(userId),
      1
    );
    //* push user_id into schedule
    console.log("deletedUser", deletedUser);
    bookingTableDB.findByIdAndUpdate(
      bookingTable.toString(),
      bookingDb,
      { new: true },
      (err, updatedBookingTable) => {
        console.log("deletedUser", deletedUser);
        if (err) {
          console.log(err);
          res.status(500).json(err);
        } else res.status(200).json({ deletedUser });
      }
    );
  });
});

module.exports = router;
