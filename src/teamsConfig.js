const mongoose = require("mongoose");

// Define team schema
const teamSchema = new mongoose.Schema({
  teamID: {
    type: String,
    unique: true,
    required: true,
  },
  numPlayers: {
    type: Number,
    required: true,
  },
});

// Create team model
const Team = mongoose.model("Team", teamSchema);

module.exports = async function connectToDatabase() {
  try {
    await mongoose.connect("mongodb://localhost:27017/login");
    console.log("Teams database connected to MongoDB");
    return Team;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};
