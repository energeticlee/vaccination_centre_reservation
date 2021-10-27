const { model, Schema } = require("mongoose");

const user = new Schema({
  username: { type: String, required: true },
  nric: { type: String, required: true },
  booking: {
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    bookingTable: {
      type: Schema.Types.ObjectId,
      ref: "bookingTable",
      required: true,
    },
    centre: {
      type: Schema.Types.ObjectId,
      ref: "centre",
      required: true,
    },
  },
});

module.exports = model("user", user);
