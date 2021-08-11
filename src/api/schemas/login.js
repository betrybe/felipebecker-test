const joi = require('joi');

module.exports = joi.object({
  email: joi.string().required().email(),
  password: joi.string().required(),
});
