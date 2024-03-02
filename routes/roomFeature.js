const router = require("express").Router();
const {
  createRoomFeature,
  updateRoomFeature,
  deleteRoomFeature,
  getRoomFeature,
} = require("../controllers/roomFeature");

// CREATE NEW ROOM
router.post("/createRoomFeature", createRoomFeature);
// UPDATE ROOM
router.put("/updateRoomFeature/:id", updateRoomFeature);
// DELETE ROOM FROM HOTEL COLLECTION
router.delete("/deleteRoomFeature/:id/", deleteRoomFeature);

// GET ALL ROOM
router.get("/getAllRoomFeature", getRoomFeature);

module.exports = router;
