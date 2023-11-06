const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

//Server-side validation for Review
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required().escapeHTML(),
  }).required(),
});

//Server-side validation for User Registration
module.exports.registrationSchema = Joi.object({
  firstname: Joi.string().min(4).required().escapeHTML(),
  lastname: Joi.string().min(4).required().escapeHTML(),
  username: Joi.string().min(6).required().escapeHTML(),
  email: Joi.string().email().required().escapeHTML(),
  avatar: Joi.string().uri().allow("").optional(),
  password: Joi.string()
    .min(8)
    .pattern(
      new RegExp("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$")
    )
    .required(),
  adminCode: Joi.string().allow("").optional(),
});

//Server-side validation for User Profile Edit
module.exports.profileEditSchema = Joi.object({
  user: Joi.object({
    firstname: Joi.string().min(4).required().escapeHTML(),
    lastname: Joi.string().min(4).required().escapeHTML(),
    username: Joi.string().min(6).required().escapeHTML(),
    email: Joi.string().email().required().escapeHTML(),
    avatar: Joi.string()
      .uri()
      .pattern(/^(http[s]?:\/\/|data:image\/).*/)
      .allow("")
      .optional(),
  }).required(),
});

//Server-side validation for password change
module.exports.passwordChangeSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .pattern(
      new RegExp("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$")
    )
    .required(),
}).unknown();

//Server-side validation for forgot & reset password
module.exports.resetPasswordSchema = Joi.object({
  password: Joi.string()
    .min(8)
    .pattern(
      new RegExp("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$")
    )
    .required(),
}).unknown();
