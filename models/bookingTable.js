const { model, Schema } = require("mongoose");

//! NOT REQUIRED
//* HARD CODED || VIDEO.SRC:LINK

//* TESTSHORTHAND = USELOCATION TO FETCH RESPECTIVE VIDEOS
const bookingTable = new Schema({
  dayMonthYear: { type: String, required: true },
  shift1: {
    timeSlot: {
      type: Schema.Types.Mixed,
      of: [{ type: Schema.Types.ObjectId, ref: "user" }],
    },
    maxCapacity: Number,
  },
  shift2: {
    timeSlot: {
      //* timeSlot: { "7": [user_id] }
      type: Schema.Types.Mixed,
      of: [{ type: Schema.Types.ObjectId, ref: "user" }],
    },
    maxCapacity: Number,
  },
  shift3: {
    timeSlot: {
      type: Schema.Types.Mixed,
      of: [{ type: Schema.Types.ObjectId, ref: "user" }],
    },
    maxCapacity: Number,
  },
  centre: { type: Schema.Types.ObjectId, ref: "centre", required: true },
  nurseRoster: {
    type: Schema.Types.ObjectId,
    ref: "nurseRoster",
  },
});

module.exports = model("bookingTable", bookingTable);
