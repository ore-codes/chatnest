import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  PORT: Joi.number().default(2457),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USER: Joi.string().required(),
  DB_PASS: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES: Joi.string().default('1h'),
});
