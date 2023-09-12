const Joi = require("joi");
//Serve-side validation for Review
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    // body: Joi.string().required().escapeHTML(),
    body: Joi.string().required(),
  }).required(),
});
