const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    maxPeople: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    ac: {
      type: Boolean,
      default: false,
    },
    img: {
      type: String,
    },
    quantity: {
      type: String,
    },
    currentbookings: [],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", RoomSchema);
