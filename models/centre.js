const { model, Schema } = require("mongoose");

const centre = new Schema({
  name: { type: String, required: true },
  minCapacity: { type: Number, required: true },
  operatingHours: {
    firstBooking: { type: Number, required: true, min: 8 },
    lastBooking: { type: Number, required: true, max: 22 },
  },
});

module.exports = model("centre", centre);
