const mongoose = require("mongoose");

const uri = "mongodb://localhost:27017/login";

const connect = mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connect
  .then(() => {
    console.log("admin Database connected successfully");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Admin = mongoose.model("admin", AdminSchema);

module.exports = Admin;
