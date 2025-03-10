const Listing = require("../models/listing");
const mpxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mpxGeocoding({ accessToken: mapToken });

module.exports.home = async (req, res, next) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderCreateListing = async (req, res) => {
  res.render("listings/create.ejs");
};

module.exports.createListing = async (req, res) => {
  try {
    let response = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);

    newListing.image = { url, filename };
    newListing.owner = req.user._id;

    const geometry = response.body.features[0].geometry;
    newListing.geometry = {
      type: geometry.type,
      coordinates: geometry.coordinates,
    };

    await newListing.save();

    req.flash("success", "Successfully created a new listing!");
    res.redirect("/stazy");
  } catch (e) {
    console.error(e);
    req.flash("error", "Failed to create a new listing.");
    res.redirect("/stazy/create");
  }
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const list = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!list) {
    req.flash("error", "Cannot find that listing!");
    return res.redirect("/stazy");
  }
  res.render("listings/show.ejs", { list });
};

module.exports.renderEditPage = async (req, res) => {
  const { id } = req.params;
  const list = await Listing.findById(id);
  if (!list) {
    req.flash("error", "Cannot find that listing!");
    return res.redirect("/stazy");
  }

  let originalImageUrl = list.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

  res.render("listings/edit.ejs", { list, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  let response = await geocodingClient
    .forwardGeocode({
      query: listing.location,
      limit: 1,
    })
    .send();

  const geometry = response.body.features[0].geometry;

  listing.geometry = {
    type: geometry.type,
    coordinates: geometry.coordinates,
  };

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Successfully edited the listing!");
  res.redirect(`/stazy/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted the listing!");
  res.redirect("/stazy");
};
