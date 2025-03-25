const Joi = require("joi");
const joi = require("joi");

module.exports = adminValidation = (data) => {
  const schema = joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().required(),
    is_active: Joi.boolean().default(false),
    bookmarks: Joi.string().optional(),
    interests: Joi.string().optional(),
    otp: Joi.string().optional(),
  });
  return schema.validate(data);
};
