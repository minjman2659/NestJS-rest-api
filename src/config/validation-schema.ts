import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
  PORT: Joi.number().required(),
  API_HOST: Joi.string().required(),
  CLIENT_HOST: Joi.string().required(),
  SECRET_KEY: Joi.string().required(),
  POSTGRES: Joi.object({
    DATABASE: Joi.string().required(),
    PORT: Joi.number().required(),
    HOST: Joi.string().required(),
    USER: Joi.string().required(),
    PW: Joi.string().required(),
  }),
});
