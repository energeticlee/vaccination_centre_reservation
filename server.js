// DEPENDENCIES
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// CONFIG
const app = express();
const PORT = process.env.PORT || 3333;

//* MONGOOSE CONFIG
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//* SERVER LINKED => DATABASE
mongoose.connection.once("open", () => {
  console.log("Connected to mongo");
});

//* MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./frontend/build")));

//* REQUIRE CONTROLLER | EXPRESS ROUTING
const centre = require("./controllers/centreController");
const bookingTable = require("./controllers/bookingTableController");
// const user = require("./controllers/user");
// const nurseRoster = require("./controllers/nurseRoster");
// const nurse = require("./controllers/nurse");

//* ROUTES
app.use("/api/centre", centre);
app.use("/api/bookingTable", bookingTable);
// app.use("/api/user", user);
// app.use("/api/nurseRoster", nurseRoster);
// app.use("/api/nurse", nurse);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "./frontend/build", "index.html"));
});

// LISTEN
app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
