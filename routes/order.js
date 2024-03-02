const router = require("express").Router();
const Order = require("../models/Order");
const Room = require("../models/Room");
const { verifyAdmin } = require("../utils/Verifytoken");
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

// CREATE ORDER
// router.post('/add', async (req, res, next) => {
//     try {
//         const newOrder = await Order(req.body);
//         await newOrder.save();
//         res.status(200).json('order saved successfully')
//     } catch (err) {
//         next(err);
//         console.log(err);
//     }
// })

// router.post("/add", async (req, res, next) => {
//   try {
//     const {
//       userid,
//       userName,
//       userEmail,
//       fromdate,
//       todate,
//       totalAmount,
//       totaldays,
//       addOns,
//       bookingStatus,
//       selectedRooms,
//     } = req.body;

//     // Check if an order already exists for the user
//     const existingOrder = await Order.findOne({ email: userEmail });

//     // Create a new customer in Stripe
//     const customer = await stripe.customers.create({
//       email: userEmail,
//       name: userName,
//     });

//     // Create a payment intent in Stripe
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: totalAmount * 100,
//       currency: "pkr",
//       automatic_payment_methods: { enabled: true },
//       metadata: {
//         fromdate,
//         todate,
//         totaldays,
//         userId: userid,
//         userName,
//         bookingStatus,
//       },
//       customer: customer.id,
//       receipt_email: userEmail,
//       description: `Payment for hotel room booking and total room quantity`,
//     });

//     console.log(paymentIntent.status);

//     if (!paymentIntent.client_secret) {
//       return res.status(500).json({ message: "Error creating payment intent" });
//     }

//     if (existingOrder) {
//       // Update the existing order if found
//       const updateOrder = await Order.findOneAndUpdate(
//         { email: userEmail },
//         {
//           $set: {
//             email: userEmail,
//           },
//           $push: {
//             currentbookings: {
//               addOns: addOns,
//               fromdate: moment(fromdate).format("DD-MM-YYYY"),
//               todate: moment(todate).format("DD-MM-YYYY"),
//               userid: userid,
//               totalAmount,
//               totaldays,
//               status: bookingStatus,
//               userName,
//               userEmail,
//               selectedRooms,
//             },
//           },
//         },
//         { upsert: true, new: true }
//       );

//       await updateOrder.save();
//       console.log(updateOrder, "here is existing Order");
//     } else {
//       const newOrder = new Order({
//         email: userEmail,
//         currentbookings: [
//           {
//             addOns: addOns,
//             fromdate: moment(fromdate).format("DD-MM-YYYY"),
//             todate: moment(todate).format("DD-MM-YYYY"),
//             userid: userid,
//             totalAmount,
//             totaldays,
//             status: bookingStatus,
//             userName,
//             userEmail,
//             selectedRooms,
//           },
//         ],
//       });

//       let roomResponse = await newOrder.save();
//       console.log(roomResponse, "here is order response");
//     }

//     const response = {
//       paymentIntentId: paymentIntent.id,
//       clientSecret: paymentIntent.client_secret.toString(),
//       totalAmount,
//     };
//     res.send(response);
//     console.log(response, "here is response of stripe");
//   } catch (err) {
//     next(err);
//     console.log(err);
//   }
// });

//using a copy

router.post("/add", async (req, res, next) => {
  try {
    const {
      userid,
      userName,
      userEmail,
      fromdate,
      todate,
      totalAmount,
      totaldays,
      bookingStatus,
      breakfast,
      lunch,
      dinner,
      mineral,
      heater,
      ac,
      foam,
      foamQuantity,
    } = req.body;

    // Create a new customer in Stripe
    const customer = await stripe.customers.create({
      email: userEmail,
      name: userName,
    });

    // Create a payment intent in Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100,
      currency: "pkr",
      automatic_payment_methods: { enabled: true },
      metadata: {
        fromdate,
        todate,
        totaldays,
        userId: userid,
        userName,
        bookingStatus,
        breakfast,
        lunch,
        dinner,
        mineral,
        heater,
        ac,
        foam,
        foamQuantity,
      },
      customer: customer.id,
      receipt_email: userEmail,
      description: `Payment for hotel room booking and total room quantity`,
    });

    console.log(paymentIntent.status);

    if (!paymentIntent.client_secret) {
      return res.status(500).json({ message: "Error creating payment intent" });
    }

    const response = {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret.toString(),
      totalAmount,
    };
    res.send(response);
    console.log(response, "here is response of stripe");
  } catch (err) {
    next(err);
    console.log(err);
  }
});

//confirm payment
router.post("/confirm-payment", async (req, res) => {
  try {
    const {
      paymentIntentId,
      userid,
      userName,
      userEmail,
      fromdate,
      todate,
      totalAmount,
      totaldays,
      addOns,
      bookingStatus,
      selectedRooms,
      breakfast,
      lunch,
      dinner,
      mineral,
      heater,
      ac,
      foam,
      foamQuantity,
    } = req.body;
    console.log(userEmail, "here is email");
    // Check if an order already exists for the user
    const existingOrder = await Order.findOne({ email: userEmail });

    // const confirmedPaymentIntent = await stripe.paymentIntents.confirm(
    //   paymentIntentId
    // );

    // const paymentMethodId = confirmedPaymentIntent.payment_method;

    // const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    if (existingOrder) {
      // Update the existing order if found
      const updateOrder = await Order.findOneAndUpdate(
        { email: userEmail },
        {
          $set: {
            email: userEmail,
          },
          $push: {
            currentbookings: {
              addOns: addOns,
              fromdate: moment(fromdate).format("DD-MM-YYYY"),
              todate: moment(todate).format("DD-MM-YYYY"),
              userid: userid,
              totalAmount,
              totaldays,
              status: bookingStatus,
              userName,
              userEmail,
              selectedRooms,
              paymentIntentId,
              breakfast,
              lunch,
              dinner,
              mineral,
              heater,
              ac,
              foam,
              foamQuantity,
            },
          },
        },
        { upsert: true, new: true }
      );

      let roomResponse = await updateOrder.save();
      res.json({ success: true, roomResponse });

      console.log(updateOrder, "here is existing Order");
    } else {
      const newOrder = new Order({
        email: userEmail,
        currentbookings: [
          {
            addOns: addOns,
            fromdate: moment(fromdate).format("DD-MM-YYYY"),
            todate: moment(todate).format("DD-MM-YYYY"),
            userid: userid,
            totalAmount,
            totaldays,
            status: bookingStatus,
            userName,
            userEmail,
            selectedRooms,
            paymentIntentId,
            breakfast,
            lunch,
            dinner,
            mineral,
            heater,
            ac,
            foam,
            foamQuantity,
          },
        ],
      });

      let roomResponse = await newOrder.save();
      res.json({ success: true, roomResponse });
      console.log(roomResponse, "here is order response");
    }
    // res.json({ success: true, paymentMethod });
  } catch (err) {
    // next(err);
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});
// GET ORDER
router.get("/get", async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).json(orders);
  } catch (err) {
    //   next(err);
    console.log(err);
  }
});

// GET BOOKED ROOM BY EMAIL
router.get("/booked", async (req, res, next) => {
  const { email } = req.query;
  try {
    const getroom = await Order.find({ email: email });
    res.status(200).json(getroom);
  } catch (err) {
    next(err);
    console.log(err);
  }
});
// VIEW BOOKED ROOM DETAILS BY ID
router.get("/bookedRoom/:id", async (req, res, next) => {
  try {
    const hotel = await Room.findById(req.params.id);
    const list = await Promise.all(
      hotel.roomNumbers.map((room) => {
        // return Room.find({room: room.roomNumbers});
        return room;
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
    console.log(err);
  }
});
// DELETE ORDER FROM ORDER COLLECTION
router.delete("/delete/:id", async (req, res, next) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("article deleted");
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// DELETE BOOKED ROOM FROM ROOM COLLECTION
router.put("/rmvBookedDates/:id", async (req, res, next) => {
  try {
    const room = await Room.updateOne(
      {},
      { $pull: { "roomNumbers.unavailableDates": "" } }
    );

    // const list = await Promise.all(
    //     room.roomNumbers.map((room) => {
    //         return (room.unavailableDates)
    //     })
    // );
    // const updated = await list.update({}, {$unset: {unavailableDates: ""}})

    // const update = await Room.updateOne(
    //     { room: req.params.id },
    //     { unavailableDates: 'dates' },
    //     {
    //         $unset: {
    //             "roomNumbers.unavailableDates": "edited",
    //             // "roomNumbers.$.unavailableDates": " ",
    //         },
    //     }
    // );
    res.status(200).json(room);
    console.log(room);
  } catch (err) {
    next(err);
    console.log(err);
  }
});
module.exports = router;
