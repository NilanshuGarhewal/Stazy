const joi = require("joi");

module.exports.listingSchema = joi.object({
  listing: joi
    .object({
      title: joi.string().min(3).max(100).required().messages({
        "string.min": "Title must be at least 3 characters.",
        "string.max": "Title cannot exceed 100 characters.",
      }),
      about: joi.string().min(10).max(1000).required().messages({
        "string.min": "About section must be at least 10 characters.",
        "string.max": "About section cannot exceed 1000 characters.",
      }),
      image: joi.string().uri().messages({
        "string.uri": "Image must be a valid URL.",
      }),
      price: joi.number().min(0).integer().required().messages({
        "number.min": "Price cannot be negative.",
        "number.base": "Price must be a number.",
        "number.integer": "Price must be a whole number.",
      }),
      country: joi.string().min(2).max(56).required().messages({
        "string.min": "Country must have at least 2 characters.",
        "string.max": "Country cannot exceed 56 characters.",
      }),
      location: joi.string().min(2).max(100).required().messages({
        "string.min": "Location must have at least 2 characters.",
        "string.max": "Location cannot exceed 100 characters.",
      }),
    })
    .required(),
});
//     res.redirect("/stazy");

module.exports.reviewSchema = joi.object({
  review: joi
    .object({
      rating: joi.number().min(1).max(5).default(3),
      comment: joi.string().required(),
    })
    .required(),
});
