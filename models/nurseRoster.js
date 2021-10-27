const { model, Schema } = require("mongoose");

const nurseRoster = new Schema({
  date: { type: Date, required: true },
  centre: {
    type: Schema.Types.ObjectId,
    ref: "centre",
    required: true,
  },
  nurseOnDuty: {
    AM: [{ type: Schema.Types.ObjectId, ref: "nurse" }],
    PM: [{ type: Schema.Types.ObjectId, ref: "nurse" }],
  },
});

module.exports = model("nurseRoster", nurseRoster);
