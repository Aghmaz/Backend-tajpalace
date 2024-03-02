const mongoose = require("mongoose");

// Define a schema for meals (breakfast, lunch, dinner)
const mealSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  menu: {
    type: String,
    required: true,
  },
});

// Define a schema for additional amenities
const amenitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

// Define the main schema including meals, amenities, and foam quantity
const schema = new mongoose.Schema({
  breakfast: mealSchema,
  lunch: mealSchema,
  dinner: mealSchema,
  ac: amenitySchema,
  heater: amenitySchema,
  mineralWater: amenitySchema,
  foam: amenitySchema,
  foamQuantity: {
    type: Number,
    default: 0,
  },
});

// Create a model for the schema
const RoomFeature = mongoose.model("RoomFeature", schema);

module.exports = RoomFeature;
