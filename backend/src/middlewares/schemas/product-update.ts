import { celebrate, Joi, Segments } from 'celebrate';

const productUpdateBodySchema = Joi.object({
  title: Joi.string()
    .min(2)
    .max(30)
    .optional(),

  image: Joi.object({
    fileName: Joi.string().required(),
    originalName: Joi.string().required(),
  })
    .optional(),

  category: Joi.string()
    .optional(),

  description: Joi.string()
    .optional(),

  price: Joi.alternatives()
    .try(Joi.number(), Joi.valid(null))
    .optional(),
}).min(1);

const validateUpdateProductBody = celebrate({
  [Segments.PARAMS]: Joi.object({
    productId: Joi.string().hex().length(24).required(),
  }),
  [Segments.BODY]: productUpdateBodySchema,
});

export default validateUpdateProductBody;
