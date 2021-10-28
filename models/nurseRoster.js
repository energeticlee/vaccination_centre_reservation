const { model, Schema } = require("mongoose");

const nurseRoster = new Schema({
  date: { type: Date, required: true },
  centre: {
    type: Schema.Types.ObjectId,
    ref: "centre",
    required: true,
  },
  nurseOnDuty: {
    shift1: [{ type: Schema.Types.ObjectId, ref: "nurse" }],
    shift2: [{ type: Schema.Types.ObjectId, ref: "nurse" }],
    shift3: [{ type: Schema.Types.ObjectId, ref: "nurse" }],
  },
  patientNurseRatio: 10,
});

module.exports = model("nurseRoster", nurseRoster);
