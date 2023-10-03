const Joi = require("joi");
//Server-side validation for Review
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    // body: Joi.string().required().escapeHTML(),
    body: Joi.string().required(),
  }).required(),
});

//Server-side validation for User Registration
module.exports.registrationSchema = Joi.object({
  firstname: Joi.string().min(4).required(),
  lastname: Joi.string().min(4).required(),
  username: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
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
    firstname: Joi.string().min(4).required(),
    lastname: Joi.string().min(4).required(),
    username: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
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
  confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
});

//Server-side validation for forgot & reset password
module.exports.resetPasswordSchema = Joi.object({
  password: Joi.string()
    .min(8)
    .pattern(
      new RegExp("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$")
    )
    .required(),
  confirm: Joi.string().valid(Joi.ref("password")).required(),
});
