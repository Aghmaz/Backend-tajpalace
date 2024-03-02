const mongoose = require("mongoose");
const path = require("path");
const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
// const cookieParser = require('cookie-parser')
dotenv.config();
const port = process.env.PORT || 3200;
const hotelRoute = require("./routes/hotels");
const authRoute = require("./routes/users");
const roomRoute = require("./routes/rooms");
const reviewRoute = require("./routes/review");
const articleRoute = require("./routes/articles");
const orderRoute = require("./routes/order");
const roomFeatureRoute = require("./routes/roomFeature");
const innerhotelRoute = require("./routes/InnerHotel");
const paymentRoute = require("./routes/payment");
mongoose
  .connect(
    "mongodb+srv://yasinjimi4u84:wzBpMDAWzknstcZps@cluster0.fgtiu5a.mongodb.net/"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log(`Couldn't connected to MongoDB, ${error}`));
// API
// app.use(cookieParser())
app.use(cors());
app.use(express.json());
app.use("/hotel", hotelRoute);
app.use("/auth", authRoute);
app.use("/room", roomRoute);
app.use("/review", reviewRoute);
app.use("/article", articleRoute);
app.use("/order", orderRoute);
app.use("/roomFeature", roomFeatureRoute);
app.use("/innerHotel", innerhotelRoute);
app.use("/payment", paymentRoute);

app.use((err, req, res, next) => {
  const errStatus = err.status || 500;
  const errMsg = err.message || "something went wrong";
  return res.status(errStatus).json({ errMsg });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./index.html"));
});
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
