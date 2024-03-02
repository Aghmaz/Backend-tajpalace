const RoomFeature = require("../models/RoomFeatures");

// ADD REVIEW
const createRoomFeature = async (req, res) => {
  try {
    const roomFeature = new RoomFeature(req.body);
    await roomFeature.save();
    res.status(201).json(roomFeature);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET REVIEW
const getRoomFeature = async (req, res, next) => {
  try {
    const roomFeatures = await RoomFeature.find();
    res.status(200).json(roomFeatures);
  } catch (error) {
    next();
    res.status(500).json({ error: error.message });
  }
};

const updateRoomFeature = async (req, res, next) => {
  try {
    const roomFeature = await RoomFeature.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(roomFeature);
  } catch (error) {
    next();
    res.status(404).json({ error: "RoomFeature not found" });
  }
};

//DELETE REVIEW
const deleteRoomFeature = async (req, res, next) => {
  try {
    const roomFeature = await RoomFeature.findByIdAndDelete(req.params.id);
    res.status(200).json(roomFeature);
  } catch (error) {
    next();
    res.status(404).json({ error: "RoomFeature not found" });
  }
};
module.exports = {
  createRoomFeature,
  getRoomFeature,
  updateRoomFeature,
  deleteRoomFeature,
};
