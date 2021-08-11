const joi = require('joi');

module.exports = joi.object({
  name: joi.string().required(),
  email: joi.string().required().email(),
  password: joi.string().required(),
  role: joi.string().default('user'),
});
