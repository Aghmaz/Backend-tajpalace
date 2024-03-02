const router = require('express').Router();
const Review = require('../models/Review');
const { addReview, getReview, deleteReview } = require('../controllers/review');
const { verifyAdmin } = require('../utils/Verifytoken');

// ADD REVIEW
router.post("/addReview", addReview)

// GET REVIEW
router.get('/getReview', getReview)

//DELETE REVIEW
router.delete('/delete/:id', verifyAdmin, deleteReview)

module.exports = router;