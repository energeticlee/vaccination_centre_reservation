const { model, Schema } = require("mongoose");

//! NOT REQUIRED
//* HARD CODED || VIDEO.SRC:LINK

//* TESTSHORTHAND = USELOCATION TO FETCH RESPECTIVE VIDEOS
const bookingTable = new Schema({
  date: { type: Date, required: true },
  timeSlot: [
    {
      type: Schema.Types.Map,
      of: [{ type: Schema.Types.ObjectId, ref: "user", required: true }],
    },
  ],
  centre: { type: Schema.Types.ObjectId, ref: "centre", required: true },
  nurseRoster: {
    type: Schema.Types.ObjectId,
    ref: "nurseRoster",
    required: true,
  },
});

module.exports = model("bookingTable", bookingTable);
