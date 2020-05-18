const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");

require("dotenv").config({ path: __dirname + "/config/.env" });

const app = express();

const uri = process.env.MONGO_DB_URI;

const PORT = process.env.PORT;

require("./middleware/passport")(passport);

app.use(cors());
app.use(express.json({ extended: true }));
app.use(passport.initialize());
app.use("/api/auth", require("./routes/auth.routes"));

async function start() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    app.listen(PORT, () => {
      console.log(`listen on port ${PORT}...`);
    });
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
}

start();
