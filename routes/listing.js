const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");

const methodOverride = require("method-override");
router.use(methodOverride("_method"));

const listingController = require("../controllers/listing");

// Home page route
router.get("/", wrapAsync(listingController.home));

// Render create listing
router.get(
  "/create",
  isLoggedIn,
  wrapAsync(listingController.renderCreateListing)
);

// Create a new listing
router.post("/", validateListing, wrapAsync(listingController.createListing));

// Show route
router.get("/:id", wrapAsync(listingController.showListing));

// Render the edit page
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditPage)
);

// Route to update a listing
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListing)
);

// Delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.deleteListing)
);

module.exports = router;
