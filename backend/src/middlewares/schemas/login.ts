import { celebrate, Joi, Segments } from 'celebrate';

const loginBodySchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .required(),
});

const validateLoginBody = celebrate({
  [Segments.BODY]: loginBodySchema,
});

export default validateLoginBody;
