const mongoose = require("mongoose");

const SportsVenueSchema = new mongoose.Schema({
  sport: {
    type: String,
    required: true,
  },
  players: {
    type: Number,
    required: true,
  },
  fromTime: {
    type: String,
    required: true,
  },
  toTime: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  pricing: {
    type: Number,
    required: true,
  },
  imagePath: {
    type: String, // Assuming the image path will be stored as a string
    required: true,
  },
});

const SportsVenue = mongoose.model(
  "SportsVenue",
  SportsVenueSchema,
  "hostsports"
);

module.exports = SportsVenue;
