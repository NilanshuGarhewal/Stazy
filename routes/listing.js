const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/WrapAsync");
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");

const methodOverride = require("method-override");
router.use(methodOverride("_method"));

// Home page route
router.get(
  "/",
  wrapAsync(async (req, res, next) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// Route to render the create listing form
router.get(
  "/create",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    res.render("listings/create.ejs");
  })
);

// Route to create a new listing
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/stazy");
  })
);

// Route to show a specific listing
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id)
      .populate("reviews")
      .populate("owner");
    if (!list) {
      req.flash("error", "Cannot find that listing!");
      return res.redirect("/stazy");
    }
    res.render("listings/show.ejs", { list });
  })
);

// Route to render the edit listing form
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id);
    if (!list) {
      req.flash("error", "Cannot find that listing!");
      return res.redirect("/stazy");
    }
    res.render("listings/edit.ejs", { list });
  })
);

// Route to update a listing
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Successfully edited the listing!");
    res.redirect(`/stazy/${id}`);
  })
);

// Route to delete a listing
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/stazy");
  })
);

module.exports = router;
