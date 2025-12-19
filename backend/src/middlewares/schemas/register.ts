import { celebrate, Joi, Segments } from 'celebrate';

const registerBodySchema = Joi.object({
  name: Joi.string(),

  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .min(6)
    .required(),
});

const validateRegisterBody = celebrate({
  [Segments.BODY]: registerBodySchema,
});

export default validateRegisterBody;
