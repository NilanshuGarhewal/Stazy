const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { validateReview, isReviewAuthor, isLoggedIn } = require("../middleware");

const reviewController = require("../controllers/review");

// Route to create a new review
router.post("/", validateReview, wrapAsync(reviewController.createReview));

// Route to delete a review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
