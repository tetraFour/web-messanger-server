const { Schema, model } = require("mongoose");

const User = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  online: { type: Date, default: new Date() },
});
User.virtual("isOnline").get(() => {
  return differenceInMinutes(new Date().toISOString(), User.online) < 5;
});

module.exports = model("User", User);
