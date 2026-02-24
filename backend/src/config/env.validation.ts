import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().default(3001),
  DATABASE_URL: Joi.string().uri().required(),

  REDIS_HOST: Joi.string().default('redis'),
  REDIS_PORT: Joi.number().default(6379),

  AUDIO_SERVICE_URL: Joi.string().uri().required(),
}).unknown(true);

