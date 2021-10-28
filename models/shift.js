const { model, Schema } = require("mongoose");

const shift = new Schema({
  schedule: {
    type: Schema.Types.Mixed,
    of: [{ type: Schema.Types.ObjectId, ref: "user" }],
  },
  maxCapacity: Number,
});

module.exports = model("shift", shift);
