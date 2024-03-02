const router = require("express").Router();
const {
  createHotels,
  updateHotels,
  deleteHotels,
  getHotelsbyId,
  getAllHotels,
  getHotelsByCity,
  countByType,
  list,
  getHotelRooms,
} = require("../controllers/hotels");
const { verifyAdmin } = require("../utils/Verifytoken");

// ADDING HOTELS
router.post("/add", verifyAdmin, createHotels);
// UPDATE HOTELS
router.put("/updateHotels/:id", verifyAdmin, updateHotels);
// DELETE HOTELS
router.delete("/delete/:id", verifyAdmin, deleteHotels);
// GET ALL HOTELS
router.get("/allhotels", getAllHotels);
// GET HOTELS BY ID
router.get("/gethotel/:id", getHotelsbyId);
// GET HOTEL BY CITY
router.get("/countByCity", getHotelsByCity);
// GET HOTEL NUMBER BY CITY
router.get("/list", list);
// GET  HOTEL BY TYPE
router.get("/countByType", countByType);
// GET HOTEL ROOM BY ID
router.get("/room/:id", getHotelRooms);

module.exports = router;
