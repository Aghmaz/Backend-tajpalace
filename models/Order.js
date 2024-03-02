const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    currentbookings: [],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
