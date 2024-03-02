const router = require("express").Router();
const { verifyAdmin } = require("../utils/Verifytoken");
const {
  createRoom,
  updateRoom,
  deleteRoom,
  getAllRooms,
  getRoomByID,
  updateRoomAvail,
  rooms,
  deleteBooked,
  addFiles,
  getRoomByUserIDBook,
} = require("../controllers/rooms");

// CREATE NEW ROOM
router.post("/createRoom/:hotelId", createRoom);
// UPDATE ROOM
router.put("/updateRoom/:id", verifyAdmin, updateRoom);
// DELETE ROOM FROM HOTEL COLLECTION
router.delete("/deleteRoom/:id/", deleteRoom);
// DELETE ROOM FROM ROOM COLLECTION
router.delete("/delete/:id", rooms);
// GET ALL ROOM
router.get("/getAllRooms", getAllRooms);
// GET ROOM BY ID
router.get("/getRoomByID/:id", getRoomByID);
//ger room by user id booking
router.get("/getRoomByUserIDBook/:userId", getRoomByUserIDBook);
// BOOK ROOM WITH EXACT DATE BY ROOM ID Y ID
router.put("/availability/:id", updateRoomAvail);

// DELETE PARTICULAR ROOMS FEILD FROM ROOM COLLECTION
router.delete("/deleteBooked/:id", verifyAdmin, deleteBooked);

module.exports = router;
