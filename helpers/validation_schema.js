const Joi = require('@hapi/joi');

const authSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(4).required()
});

module.exports = { authSchema }