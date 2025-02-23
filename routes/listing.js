const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");

const methodOverride = require("method-override");
router.use(methodOverride("_method"));

const listingController = require("../controllers/listing");

// Require multer
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router
  .route("/")
  .get(wrapAsync(listingController.home)) // Home page
  // .post(validateListing, wrapAsync(listingController.createListing)); // Create a new listing
  .post(upload.single("image"), wrapAsync(listingController.createListing)); // Create a new listing

// Render create listing
router.get(
  "/create",
  isLoggedIn,
  wrapAsync(listingController.renderCreateListing)
);

// Show route
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing)) // Show a listing
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing) // Update a listing
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing) // Delete a listing
  );

// Render the edit page
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditPage)
);

module.exports = router;
