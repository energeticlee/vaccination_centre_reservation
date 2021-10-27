const { model, Schema } = require("mongoose");

const centre = new Schema({
  name: { type: String, required: true },
  minCapacity: { type: Number, required: true },
  operatingHours: {
    firstBooking: { type: Date, required: true },
    lastBooking: { type: Date, required: true },
  },
});

module.exports = model("centre", centre);
