import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import UgrDisableController from '../controllers/UgrDisableController';
import UgrsController from '../controllers/UgrsController';

const ugrsRouter = Router();
ugrsRouter.use(ensureAuthenticated);

const ugrsController = new UgrsController();
const ugrDisableController = new UgrDisableController();

ugrsRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      page: Joi.number(),
      limit: Joi.number(),
      exclude: Joi.boolean(),
      name: Joi.string(),
    },
  }),
  ugrsController.index,
);

ugrsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      enabled: Joi.boolean(),
    },
  }),
  ugrsController.create,
);

ugrsRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  ugrsController.edit,
);

ugrsRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
    [Segments.BODY]: {
      name: Joi.string().required(),
      enabled: Joi.boolean(),
    },
  }),
  ugrsController.update,
);

ugrsRouter.patch(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  ugrDisableController.update,
);

export default ugrsRouter;
