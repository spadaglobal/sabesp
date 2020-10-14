import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import ReasonsController from '../controllers/ReasonsController';

const reasonsRouter = Router();
reasonsRouter.use(ensureAuthenticated);

const reasonsController = new ReasonsController();

reasonsRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      page: Joi.number(),
      limit: Joi.number(),
      requirement_id: Joi.string().required(),
    },
  }),
  reasonsController.index,
);

reasonsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      description: Joi.string().required(),
      requirement_id: Joi.string().required(),
    },
  }),
  reasonsController.create,
);

reasonsRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
    [Segments.BODY]: {
      description: Joi.string().required(),
      requirement_id: Joi.string().required(),
    },
  }),
  reasonsController.update,
);

reasonsRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  reasonsController.edit,
);

reasonsRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().required(),
    },
  }),
  reasonsController.delete,
);

export default reasonsRouter;
