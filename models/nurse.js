const { model, Schema } = require("mongoose");

const nurse = new Schema({
  name: { type: String, required: true },
  contactNumber: { type: String, required: true },
});

module.exports = model("nurse", nurse);
