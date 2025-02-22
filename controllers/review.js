const Listing = require("../models/listing");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  res.redirect(`/stazy/${req.params.id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Comment deleted!");
  res.redirect(`/stazy/${id}`);
};
