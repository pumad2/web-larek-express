import { celebrate, Joi, Segments } from 'celebrate';

const productBodySchema = Joi.object({
  title: Joi.string()
    .min(2)
    .max(30)
    .required(),

  image: Joi.object({
    fileName: Joi.string().required(),
    originalName: Joi.string().required(),
  })
    .required(),

  category: Joi.string()
    .required(),

  description: Joi.string()
    .optional(),

  price: Joi.alternatives()
    .try(Joi.number(), Joi.valid(null))
    .optional(),
});

const validateCreateProductBody = celebrate({
  [Segments.BODY]: productBodySchema,
});

export default validateCreateProductBody;
