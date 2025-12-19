import { celebrate, Joi, Segments } from 'celebrate';

const validateProductId = celebrate({
  [Segments.PARAMS]: Joi.object({
    productId: Joi.string().hex().length(24).required(),
  }),
});

export default validateProductId;
