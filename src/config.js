const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/login");

connect
  .then(() => {
    console.log("user database connected successfully");
  })
  .catch(() => {
    console.log("db cannot be connected");
  });

const LoginSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
const collection = new mongoose.model("users", LoginSchema);

module.exports = collection;
