const mongoose = require("mongoose");

const InnerHotelSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      default: 1,
    },
    caseImage: [
      {
        type: Object,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("InnerHotel", InnerHotelSchema);
