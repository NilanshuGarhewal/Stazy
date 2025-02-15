const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const Review = require("../models/review.js");
const { reviewSchema } = require("../schema.js");
const wrapAsync = require("../utils/WrapAsync");
const ExpressError = require("../utils/ExpressError");

// Middleware to validate review data
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(
      400,
      error.details.map((err) => err.message).join(", ")
    );
  } else {
    next();
  }
};

// Route to create a new review
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/stazy/${req.params.id}`);
  })
);

// Route to delete a review
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Comment deleted!");
    res.redirect(`/stazy/${id}`);
  })
);

module.exports = router;
