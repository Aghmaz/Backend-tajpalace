const router = require("express").Router();
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

router.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});
const Room = require("../models/Room");

router.post("/:roomId/bookings/payment-intent", async (req, res) => {
  try {
    const {
      roomQuantity,
      userid,
      userName,
      userEmail,
      fromdate,
      todate,
      totalAmount,
      totaldays,
      addOns,
      bookingStatus,
    } = req.body;
    let roomId = req && req.params && req.params.roomId;
    const hotelRoom = await Room.findById(roomId);
    if (!hotelRoom) {
      return res.status(400).json({ message: "Hotel not found" });
    }
    const customer = await stripe.customers.create({
      email: userEmail,
      name: userName,
    });

    if (hotelRoom && totalAmount !== undefined && totalAmount !== null) {
      const roomTmp = await Room.findOneAndUpdate({ _id: hotelRoom._id });
      roomTmp.currentbookings.push({
        addOns: addOns,
        roomQuantity,
        fromdate: moment(fromdate).format("DD-MM-YYYY"),
        todate: moment(todate).format("DD-MM-YYYY"),
        userid: userid,
        totalAmount,
        totaldays,
        status: bookingStatus,
        userName,
        userEmail,
        roomtitle: hotelRoom.title,
      });

      let roomResponse = await roomTmp.save();
      console.log(roomResponse, "here is response");

      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount * 100,
        currency: "usd",
        automatic_payment_methods: { enabled: true },
        metadata: {
          fromdate,
          roomId,
          roomQuantity,
          todate,
          totaldays,
          userId: userid,
          addOns,
          roomName: hotelRoom.title,
          bookingStatus,
        },
        customer: customer.id,
        receipt_email: userEmail,
        description: `Payment for ${hotelRoom.name} and total room quantity ${roomQuantity}`,
      });

      if (!paymentIntent.client_secret) {
        return res
          .status(500)
          .json({ message: "Error creating payment intent" });
      }

      const response = {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret.toString(),
        totalAmount,
      };
      res.send(response);
      console.log(response, "here is response of stripe");
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
});

module.exports = router;
